from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http.response import HttpResponse, JsonResponse, Http404, HttpResponseBadRequest, HttpResponseForbidden
from django.db.models import Q

import json

from .models import User, Conversation, Message

# Create your views here.

@api_view(['POST'])
def register_user(request):

    # Get e-mail address, username, and password from request's body
    email = json.loads(request.body).get('email', '')
    username = json.loads(request.body).get('username', '')
    password = json.loads(request.body).get('password', '')

    new_user = User(email=email, name=username)
    new_user.set_password(password)
    new_user.save()

    return HttpResponse('Success.')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):

    # Get search string from request's params
    s = request.GET.get('s', '')

    users = User.objects.filter(Q(name__icontains=s) | Q(email__icontains=s)).exclude(pk=request.user.id)

    return JsonResponse([ user.serialize() for user in users.all()], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    
    return JsonResponse( [conversation.inbox_serialize(request.user) for conversation in request.user.active_conversations.all()], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_conversation(request):

    # Get the ids of the users to be added to the conversation
    user_ids = json.loads(request.body).get('user_ids')

    users = []
    users.append(request.user)

    for user_id in user_ids:
        try:
            users.append(User.objects.get(id=user_id))
        except User.DoesNotExist or user_id == request.user.id:
            raise Http404(f'ERROR: invalid user id ({user_id})')

    
    conversation = Conversation()
    conversation.save()

    for user in users:
        conversation.members.add(user)
    
    conversation.members.add(request.user)
    conversation.active_members.add(request.user)

    return JsonResponse( conversation.inbox_serialize(request.user), safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group_chat(request):
    # Get the group's name and ids of the users to be added to the conversation
    name = json.loads(request.body).get('name')
    user_ids = json.loads(request.body).get('user_ids')

    users = []
    users.append(request.user)

    for user_id in user_ids:
        try:
            users.append(User.objects.get(id=user_id))
        except User.DoesNotExist or user_id == request.user.id:
            raise Http404(f'ERROR: invalid user id ({user_id})')

    
    new_group_chat = Conversation(name=name, is_group_chat=True)
    new_group_chat.save()

    for user in users:
        new_group_chat.members.add(user)
        new_group_chat.active_members.add(user)

    new_group_chat.members.add(request.user)
    new_group_chat.active_members.add(request.user)
    new_group_chat.admins.add(request.user)

    notification = Message(is_notification=True, conversation=new_group_chat, content=f'{request.user.name} created this group.')
    notification.save()

    return JsonResponse( new_group_chat.inbox_serialize(request.user), safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def delete_group_chat(request):

    # Get conversation id from the request's body.
    conversation_id = json.loads(request.body).get('conversation_id', '')

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR : conversation with id {conversation_id} does not exist.')

    for message in conversation.messages.all():
        message.cleared_by.add(request.user) if request.user not in message.cleared_by.all() else None

    
    conversation.active_members.remove(request.user)
    conversation.members.remove(request.user)
    conversation.active = False

    return HttpResponse('Success')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_group_members(request):

    group_id = json.loads(request.body).get('group_id', '')
    user_ids = json.loads(request.body).get('user_ids', '')

    if group_id is None or user_ids is None:
        return HttpResponseBadRequest('ERROR: a group id and a list of user ids must be provided.')
    
    try:
        group = Conversation.objects.get(id=group_id)
    except Conversation.DoesNotExist:
        raise Http404('ERROR: group with id={group_id} does not exist.')
    
    if request.user not in group.admins.all():
        return HttpResponseForbidden('ERROR: requester does not have permissions to perform this action.')
    
    for user_id in user_ids:
        try:
            user = User.objects.get(id=user_id)
            group.members.add(user) if user not in group.members.all() else group.members.remove(user)
            group.active_members.add(user) if user not in group.active_members.all() else group.active_members.remove(user)

        except User.DoesNotExist:
            raise Http404(f'ERROR: user with id={user_id} not found.')
        
        return HttpResponse('Success')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_group_admins(request):

    group_id = json.loads(request.body).get('group_id', '')
    user_ids = json.loads(request.body).get('user_ids', '')

    if group_id is None or user_ids is None:
        return HttpResponseBadRequest('ERROR : a group id and a list of user ids must be provided.')
    
    try:
        group = Conversation.objects.get(id=group_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: group with id={group_id} does not exist.')
    
    if request.user not in group.admins.all():
        return HttpResponseForbidden(f'ERROR: requester does not have permissions to perform this action.')

    for user_id in user_ids:
        try:
            user = User.objects.get(id=user_id)

            if user not in group.members.all() :
                return HttpResponseForbidden(f'ERROR: user with id={user_id} is not a member of this group chat.')

            group.admins.add(user) if user not in group.admins.all() else group.admins.remove(user)
        except Conversation.DoesNotExist:
            raise Http404('ERROR: user with id={id} does not exist.')
        
    return HttpResponse('Success')
        
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def clear_conversation(request):

    conversation_id = json.loads(request.body).get('conversation_id', '')
    remove_from_inbox = json.loads(request.body).get('remove_from_inbox')

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: conversation with id={conversation_id} does not exist.')


    if request.user not in conversation.members.all():
        return HttpResponseForbidden('ERROR: requester does not have permission to delete this conversation.')
    
    for message in conversation.messages.all():
        message.cleared_by.add(request.user) if request.user not in message.cleared_by.all() else None

    if remove_from_inbox and request.user in conversation.active_members.all():
        conversation.active_members.remove(request.user)
        return HttpResponse('Success.')

    return JsonResponse( conversation.serialize(request.user), safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation_messages(request):

    conversation_id = request.GET.get('conversation_id', '')

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Http404(f'ERROR : conversation with id={conversation_id} does not exist')
    
    return JsonResponse([message.serialize(request.user) for message in conversation.messages.all() if request.user not in message.cleared_by.all()], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_starred_messages(request):

    return JsonResponse([message.serialize(request.user) for message in request.user.starred_messages.all()], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_message(request):

    conversation_id = json.loads(request.body).get('conversation_id', '')
    content = json.loads(request.body).get('content', '')

    if conversation_id is None or conversation_id == '' or content is None or content == '':
        return HttpResponseBadRequest('ERROR: A valid conversation id and a non-empty message content must be provided.')

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: conversation with id={conversation_id} does not exist.')
    
    
    if request.user not in conversation.members.all():
        return HttpResponseForbidden('ERROR: requester is not part of this conversation.')

    new_message = Message(conversation=conversation, content=content, sender=request.user)
    new_message.save()

    for user in conversation.members.all():
        conversation.active_members.add(user) if user not in conversation.active_members.all() else None

    return JsonResponse( new_message.serialize(request.user), safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def delete_message(request):

    message_id = json.loads(request.body).get('message_id', '')
    permanent = json.loads(request.body).get('permanent', '')

    if message_id is None or message_id == '':
        return HttpResponseBadRequest('ERROR: a valid message id must be provided.')
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return Http404(f'ERROR: message with id={message_id} does not exist.')
    
    if request.user != message.sender and request.user not in message.conversation.members.all():
        return HttpResponseForbidden('ERROR: requester does not have permission to delete this message.')
    
    if permanent:
        message.delete()
    else:
        message.cleared_by.add(request.user) if request.user not in message.cleared_by.all() else None

    return JsonResponse(message.conversation.serialize(request.user), safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def star_message(request):

    message_id = json.loads(request.body).get('message_id', '')

    if message_id is None or message_id == '':
        return HttpResponseBadRequest('ERROR: a valid message id must be provided.')
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return Http404(f'ERROR: message with id={message_id} does not exist.')


    if request.user not in message.conversation.members.all():
        return HttpResponseForbidden('ERROR: requester does not have permissions to perform this action.')
    
    message.starred_by.add(request.user) if request.user not in message.starred_by.all() else message.starred_by.remove(request.user)
    
    return HttpResponse('Success.')

