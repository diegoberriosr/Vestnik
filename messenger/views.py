from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http.response import HttpResponse, JsonResponse, Http404, HttpResponseBadRequest, HttpResponseForbidden

import json

from .models import User, Conversation, Message

# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):

    # Get user id from the request's body.
    user_id =  json.loads(request.body).get('user_id', '')   

    # Get user by id, return an exception if it does not exist.
    try:
        user = User.objects.get(id=user_id)
    
    except User.DoesNotExist:
        raise Http404(f'ERROR: user with id={user_id} does not exist.')

    return JsonResponse( [conversation.serialize() for conversation in request.user.active_conversations.all()], safe=False)


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
        conversation.members.append(user)

    conversation.active_members.append(request.user)

    return JsonResponse( conversation.serialize(request.user), safe=False)


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

    if message_id is None or message_id == '':
        return HttpResponseBadRequest('ERROR: a valid message id must be provided.')
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return Http404(f'ERROR: message with id={message_id} does not exist.')
    
    if request.user != message.sender:
        return HttpResponseForbidden('ERROR: requester does not have permission to delete this message.')
    
    message.delete()

    return HttpResponse('Success.')


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

