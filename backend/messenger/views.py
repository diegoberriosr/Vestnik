from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http.response import HttpResponse, JsonResponse, Http404, HttpResponseBadRequest, HttpResponseForbidden
from django.db.models import Q
from django.db.models import Max
from django.utils import timezone
from django.conf import settings
import json
import boto3
import mimetypes

from .models import User, Conversation, Message
from .utils import post_image_to_bucket

# Create your views here.

@api_view(['POST'])
def register_user(request):

    # Get e-mail address, username, and password from request's body
    email = json.loads(request.body).get('email', '')
    name = json.loads(request.body).get('name', '')
    password = json.loads(request.body).get('password', '')

    new_user = User(email=email, name=name)
    new_user.set_password(password)
    new_user.save()

    return HttpResponse('Success.')


@api_view(['PUT'])
def update_login_status(request):
    user = request.user
    user.is_online = not user.is_online
    user.save()
    if not user.is_online:
        user.last_seen = timezone.now()
        user.save()

    return HttpResponse('Success.')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):

    name = request.POST.get('name')
    info = request.POST.get('info')
    pfp = request.FILES.get('pfp')

    user = request.user
    user.name = name
    user.info = info

    if pfp is not None:
        s3 = boto3.client(
            's3',
            aws_access_key_id_id_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        post_image_to_bucket(s3, pfp, user, 'pfp', f'profiles/{user.pk}')
    
    user.save()
    
    return JsonResponse({
        'name' : user.name,
        'info' : user.info,
        'pfp' : user.pfp
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):

    # Get search string from request's params
    s = request.GET.get('s', '')

    users = User.objects.filter(Q(name__icontains=s) | Q(email__icontains=s)).exclude(pk=request.user.id)

    return JsonResponse([ user.serialize() for user in users.all()], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_id(request):

    user_ids = request.GET.getlist('user_ids[]', '')
    conversation_id = request.GET.get('conversation_id', '')

    print(user_ids)
    if user_ids is None or conversation_id is None or conversation_id == '':
        return HttpResponseBadRequest('ERROR: at least one valid user id must be provided')
    
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: conversation with id={conversation_id} does not exist')

    users = []

    for user_id in user_ids:
        try:
            user = User.objects.get(id=user_id)
            users.append(user)
        except User.DoesNotExist:
            raise Http404(f'ERROR : user with id={user_id} does not exist')
        
    return JsonResponse([ user.g_serialize(conversation) for user in users], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):

    conversations = request.user.active_conversations.annotate(
        last_message_timestamp = Max('messages__timestamp')
    ).order_by('-last_message_timestamp')
    
    return JsonResponse( [conversation.inbox_serialize(request.user) for conversation in conversations], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation(request):

    conversation_id = request.GET.get('conversation_id', '')

    if conversation_id is None or conversation_id == '':
        return HttpResponseBadRequest(f'ERROR: a valid conversation id must be provided.')
    
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: conversation with id={conversation_id} does not exist.')
    

    if request.user not in conversation.members.all():
        return HttpResponseForbidden(f'ERROR: requester does not have permission to perform this action.')
    

    return JsonResponse([ conversation.inbox_serialize(request.user)], safe=False)
    

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

    conversations = Conversation.objects.filter(members__in=users)
    conversation_exists = any( list(conversation.members.all()) == list(users) for conversation in conversations)

    if conversation_exists:
        return HttpResponseForbidden('ERROR : Conversation already exists.')
    
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
def update_group_name(request):

    group_id = json.loads(request.body).get('group_id', '')
    name = json.loads(request.body).get('name', '')

    if group_id is None or group_id == '' or name is None or name == '':
        return HttpResponseBadRequest('ERROR: a valid group_id and name string must be provided.')

    try:
        group = Conversation.objects.get(id=group_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: group with id={group_id} does not exist.')

    group.name = name
    group.save()

    content = f"{request.user.name} changed this group's name to {name}"
    notification = Message(is_notification=True, conversation=group, content=content)
    notification.save()

    return JsonResponse( notification.serialize(request.user), safe=False)


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
    
    users = []

    for user_id in user_ids:
        try:
            user = User.objects.get(id=user_id)
            group.members.add(user) if user not in group.members.all() else group.members.remove(user)
            group.active_members.add(user) if user not in group.active_members.all() else group.active_members.remove(user)

            if user in group.admins.all():
                group.admins.remove(user)

            users.append(user)

            for message in group.messages.all():
                message.cleared_by.add(user) if user not in message.cleared_by.all() else None

            content = f'{user.name} was removed from this group' if user not in group.members.all() else f'{user.name} was added to this group'
            notification = Message(conversation=group, sender=None, content=content, is_notification=True)
            notification.save()

        except User.DoesNotExist:
            raise Http404(f'ERROR: user with id={user_id} not found.')
        
    
    if (group.admins.count() == 0 and group.members.count() > 0):
        group.admins.add(group.active_members.first())
        content = f'{group.active_members.first()} is now an admin of this group'
        notification = Message(conversation=group, sender=None, content=content, is_notification=True)
        notification.save()

    if(group.active_members.count() == 0):
        group.delete()
        return HttpResponse('Group was deleted due to lack of members.')
    
    return JsonResponse([user.serialize() for user in users], safe=False)


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
            content = f'{user.name} is no longer an admin for this group' if user not in group.admins.all() else f'{user.name} is now an admin for this group'
            notification = Message(conversation=group, sender=None, content=content, is_notification=True)
            notification.save()

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
        print(request.user in message.cleared_by.all())
        message.cleared_by.add(request.user) if request.user not in message.cleared_by.all() else None
        message.read_by.add(request.user) if request.user not in message.read_by.all() else None

    if remove_from_inbox and request.user in conversation.active_members.all():
        conversation.active_members.remove(request.user)
        conversation.save()
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
    
    for message in conversation.messages.all():
        message.read_by.add(request.user) if request.user != message.sender and request.user not in message.read_by.all() else None 
    
    return JsonResponse([message.serialize(request.user) for message in conversation.messages.all() if request.user not in message.cleared_by.all()], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_message(request):
    
    message_id = request.GET.get('message_id')

    if message_id is None or message_id == '':
        return HttpResponseBadRequest('ERROR: a valid message id must be provided')

    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        raise Http404(f'ERROR: message with id={message_id} does not exist.')
    
    if request.user not in message.conversation.members.all():
        return HttpResponseForbidden('ERROR: requester does not have permissions to perform this action.')

    return JsonResponse( message.serialize(request.user), safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_starred_messages(request):

    return JsonResponse([message.serialize(request.user) for message in request.user.starred_messages.all()], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_message(request):

    conversation_id = request.POST.get('conversation_id')
    content = request.POST.get('content')
    image = request.FILES.get('image')

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

    if image is not None:
        s3 = boto3.client(
            's3',
            aws_access_key_id_id_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        post_image_to_bucket(s3, image, new_message, 'image', f'conversations/{conversation.id}')

    new_message.save()

    for user in conversation.members.all():
        conversation.active_members.add(user) if user not in conversation.active_members.all() else None

    return JsonResponse( new_message.serialize(request.user), safe=False)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def see_message(request):

    message_id = json.loads(request.body).get('message_id')

    if message_id is None or message_id == '':
        return HttpResponseBadRequest('ERROR: a valid message id must be provided.')
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        raise Http404(f'ERROR: message with id={message_id} does not exist.')
    
    if request.user not in message.conversation.members.all():
        return HttpResponseForbidden('ERROR: requester does not have permissions to perform this action.')
    
    message.read_by.add(request.user) if request.user not in message.read_by.all() and request.user != message.sender else None

    return JsonResponse( message.serialize(request.user), safe=False) 


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
    
    conversation = message.conversation

    if permanent:
        if message.image:
            s3 = boto3(
                's3',
                aws_access_key_id_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )

            mimetype, _ = mimetypes.guess_type(message.image)
            extension = mimetypes.guess_extension(mimetype)
    
            s3.delete_object(Bucket='bellr-image-storage', Key=f'conversations/{conversation.id}/image{extension}')

        message.delete()

    else:
        message.cleared_by.add(request.user) if request.user not in message.cleared_by.all() else None
    
    last_message = conversation.messages.exclude(cleared_by__in=[request.user]).last()

    return JsonResponse(last_message.serialize(request.user) if last_message else None, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_last_message(request):

    conversation_id = request.GET.get('conversation_id', '')
    is_notification = request.GET.get('is_notification', '')

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR : conversation with id={conversation_id} does not exist')
    
    if request.user not in conversation.members.all():
        return HttpResponseForbidden('ERROR: requester does not have permissions to perform this action')
    
    message = conversation.messages.filter(is_notification=True).last() if is_notification else conversation.messages.last()

    return JsonResponse( message.serialize(request.user) if message else None, safe=False)


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


@api_view(['GET'])
def check_email(request):

    email = request.GET.get('email', '')
    email_exists = True

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        email_exists = False


    return JsonResponse( { 'email_exists' : email_exists }, safe=False)

