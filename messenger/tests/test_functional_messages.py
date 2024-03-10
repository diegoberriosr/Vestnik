from django.test import TestCase
from .. import views
from rest_framework.test import APIRequestFactory, force_authenticate
from ..models import User, Conversation, Message
from django.urls import reverse
import json

class TestCreateMessage(TestCase):
    def setUp(self):
        user1 = User(email='test@mail.com', name='Test')
        user1.save()
        self.user1 = user1

        user2 = User(email='test2@mail.com', name='Test 2')
        user2.save()
        self.user2 = user2

        user3 = User(email='test3@mail.com', name='Test 3')
        user3.save()
        self.user3 = user3

        conversation = Conversation()
        conversation.save() 
        conversation.members.add(self.user1)
        conversation.active_members.add(self.user1)
        conversation.members.add(self.user2)
        self.conversation = conversation    

        message1 = Message(sender=user1, conversation=conversation, content='Test message 1')
        message2 = Message(sender=user2, conversation=conversation, content='Test message 2')
        message3 = Message(sender=user1, conversation=conversation, content='Test message 3')

        message1.save()
        message2.save()
        message3.save()

        self.message1 = message1
        self.message2 = message2
        self.message3 = message3

        self.factory = APIRequestFactory()

    def test_create_message(self):

        self.assertEqual(Message.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)


        data = { 'conversation_id' : 1, 'content' : 'Test message 4'}

        request = self.factory.post(reverse('create message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.create_message(request)

        self.conversation.refresh_from_db()
        new_message = self.conversation.messages.last()

        self.assertEqual(200, response.status_code)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 4)
        self.assertEqual(new_message.sender, self.user1)
        self.assertEqual(new_message.content, data['content'])

    
    def test_create_message_without_permission(self):

        self.assertEqual(Message.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)


        data = { 'conversation_id' : 1, 'content' : 'Test message 4'}

        request = self.factory.post(reverse('create message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user3)
        response = views.create_message(request)

        self.conversation.refresh_from_db()

        self.assertEqual(403, response.status_code)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)


class TestDeleteMessage(TestCase):
    def setUp(self):
        user1 = User(email='test@mail.com', name='Test')
        user1.save()
        self.user1 = user1

        user2 = User(email='test2@mail.com', name='Test 2')
        user2.save()
        self.user2 = user2

        user3 = User(email='test3@mail.com', name='Test 3')
        user3.save()
        self.user3 = user3

        conversation = Conversation()
        conversation.save() 
        conversation.members.add(self.user1)
        conversation.active_members.add(self.user1)
        conversation.members.add(self.user2)
        self.conversation = conversation    

        message1 = Message(sender=user1, conversation=conversation, content='Test message 1')
        message2 = Message(sender=user2, conversation=conversation, content='Test message 2')
        message3 = Message(sender=user1, conversation=conversation, content='Test message 3')

        message1.save()
        message2.save()
        message3.save()

        self.message1 = message1
        self.message2 = message2
        self.message3 = message3

        self.factory = APIRequestFactory()


    def test_delete_message(self):

        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertEqual(self.message1.sender, self.user1)

        data = {'message_id' : 1}

        request = self.factory.put(reverse('delete message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)

        response = views.delete_message(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(Message.objects.count(), 2)


    def test_delete_message_without_permissions(self):

        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertEqual(self.message1.sender, self.user1)

        data = {'message_id' : 1}

        request = self.factory.put(reverse('delete message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user3)

        response = views.delete_message(request)

        self.assertEqual(403, response.status_code)
        self.assertEqual(Message.objects.count(), 3)


class TestStarMessage(TestCase):

    def setUp(self):
        user1 = User(email='test@mail.com', name='Test')
        user1.save()
        self.user1 = user1

        user2 = User(email='test2@mail.com', name='Test 2')
        user2.save()
        self.user2 = user2

        user3 = User(email='test3@mail.com', name='Test 3')
        user3.save()
        self.user3 = user3

        conversation = Conversation()
        conversation.save() 
        conversation.members.add(self.user1)
        conversation.active_members.add(self.user1)
        conversation.members.add(self.user2)
        self.conversation = conversation    

        message1 = Message(sender=user1, conversation=conversation, content='Test message 1')
        message2 = Message(sender=user2, conversation=conversation, content='Test message 2')
        message3 = Message(sender=user1, conversation=conversation, content='Test message 3')

        message1.save()
        message2.save()
        message3.save()

        self.message1 = message1
        self.message2 = message2
        self.message3 = message3

        self.message1.starred_by.add(self.user1)

        self.factory = APIRequestFactory()


    def test_star_message(self):

        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertFalse(self.user1 in self.message2.starred_by.all())

        data = { 'message_id' : 2}

        request = self.factory.put(reverse('star message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.star_message(request)

        self.message1.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertTrue(self.user1 in self.message2.starred_by.all())


    def test_unstar_message(self):

        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertTrue(self.user1 in self.message1.starred_by.all())

        data = { 'message_id' : 1}

        request = self.factory.put(reverse('star message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.star_message(request)

        self.message1.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertFalse(self.user1 in self.message1.starred_by.all())


    def test_star_message_without_permissions(self):

        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertFalse(self.user3 in self.message2.starred_by.all())

        data = { 'message_id' : 2}

        request = self.factory.put(reverse('star message'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user3)
        response = views.star_message(request)

        self.message1.refresh_from_db()

        self.assertEqual(403, response.status_code)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 3)
        self.assertFalse(self.user3 in self.message2.starred_by.all())











        