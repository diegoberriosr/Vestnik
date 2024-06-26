from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from ..models import User, Conversation, Message
from .. import views
from django.urls import reverse

import json


class TestCreateConversation(TestCase):
    def setup(self):
        user1 = User(email='test@mail.com', name='Test')
        user1.save()
        self.user1 = user1

        user2 = User(email='test2@mail.com', name='Test 2')
        user2.save()
        self.user2 = user2

        user3 = User(email='test3@mail.com', name='Test 3')
        user3.save()
        self.user3 = user3

        conversation = Conversation(is_group=True)
        conversation.save()
        self.conversation = conversation    

        conversation.members.add(self.user1)
        conversation.active_members.add(self.user1)

        conversation.members.add(self.user2)
        conversation.active_members.add(self.user2)

        conversation.members.add(self.user3)
        conversation.active_members.add(self.user3)

        conversation.admins.add(self.user1)
        conversation.admins.add(self.user2)


        self.factory = APIRequestFactory()

    def create_conversation(self):
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(Conversation.objects.count(), 1)

        data = { 'user_ids' : [2] }

        request = self.factory.post(reverse('create conversation'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.create_conversation(request)

        conversation = Conversation.objects.get(id=1)

        self.assertEqual(200, response.status_code)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(Conversation.objects.count(), 2)
        self.assertEqual([self.user1, self.user2], conversation.active_members.all())
        self.assertTrue(self.user1 in conversation.active_members.all())
        self.assertTrue(self.user2 not in conversation.active_members.all())

class TestDeleteConversation(TestCase):
   
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


    def test_clear_conversation(self):
        
        self.assertFalse(self.user1 in self.message1.cleared_by.all())
    
        data = { 'conversation_id' : 1 }

        request = self.factory.put(reverse('clear conversation'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.clear_conversation(request)

        self.assertEqual(200, response.status_code)
        self.assertTrue(self.user1 in self.message1.cleared_by.all())
        self.assertTrue(self.user1 in self.conversation.active_members.all())

    
    def test_remove_conversation_from_inbox(self):
        
        self.assertTrue(self.user1 in self.conversation.active_members.all())
        self.assertFalse(self.user1 in self.message1.cleared_by.all())
    
        data = { 'conversation_id' : 1, 'remove_from_inbox' : True}

        request = self.factory.put(reverse('clear conversation'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.clear_conversation(request)

        self.conversation.refresh_from_db()
        self.message1.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertFalse(self.user2 in self.conversation.active_members.all())
        self.assertTrue(self.user1 in self.message1.cleared_by.all())


    def test_clear_conversation_without_permissions(self):

          
        self.assertTrue(self.user1 in self.conversation.active_members.all())
        self.assertFalse(self.user1 in self.message1.cleared_by.all())

        data = {'conversation_id' : 1}

        request = self.factory.put(reverse('clear conversation'), json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user3)
        response = views.clear_conversation(request)

        self.assertEqual(403, response.status_code)

        self.conversation.refresh_from_db()
        self.message1.refresh_from_db()


class TestUpdateAdmins(TestCase):
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

        conversation = Conversation(is_group_chat=True, name='Test group')
        conversation.save()
        self.conversation = conversation    

        conversation.members.add(self.user1)
        conversation.active_members.add(self.user1)

        conversation.members.add(self.user2)
        conversation.active_members.add(self.user2)

        conversation.members.add(self.user3)
        conversation.active_members.add(self.user3)

        conversation.admins.add(self.user1)
        conversation.admins.add(self.user2)


        self.factory = APIRequestFactory()

    def test_add_admin(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [3]
        }

        request = self.factory.put(reverse('update group admins'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.update_group_admins(request)

        self.conversation.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 3)

    def test_add_admin(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [3]
        }

        request = self.factory.put(reverse('update group admins'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.update_group_admins(request)

        self.conversation.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 3)

    def test_remove_admin(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [2]
        }

        request = self.factory.put(reverse('update group admins'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.update_group_admins(request)

        self.conversation.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 1)


    def test_add_admin_without_permissions(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [3]
        }

        request = self.factory.put(reverse('update group admins'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user3)
        response = views.update_group_admins(request)

        self.conversation.refresh_from_db()

        self.assertEqual(403, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.admins.count(), 2)


class TestUpdateGroupMembers(TestCase):
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

        conversation = Conversation(is_group_chat=True, name='Test group')
        conversation.save()
        self.conversation = conversation    

        conversation.members.add(self.user1)
        conversation.active_members.add(self.user1)

        conversation.members.add(self.user2)
        conversation.active_members.add(self.user2)

        conversation.admins.add(self.user1)
        conversation.admins.add(self.user2)


        self.factory = APIRequestFactory()

    def test_add_member(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.members.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [3]
        }

        request = self.factory.put(reverse('update group members'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.update_group_members(request)

        self.conversation.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.members.count(), 3)


    def test_remove_member(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.members.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [2]
        }

        request = self.factory.put(reverse('update group members'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user1)
        response = views.update_group_members(request)

        self.conversation.refresh_from_db()

        self.assertEqual(200, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.members.count(), 1)


    def test_add_member_without_permissions(self):
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.members.count(), 2)

        data = {
            'group_id' : 1,
            'user_ids' : [3]
        }

        request = self.factory.put(reverse('update group members'), data=json.dumps(data), content_type='application/json')
        force_authenticate(request=request, user=self.user3)
        response = views.update_group_members(request)

        self.conversation.refresh_from_db()

        self.assertEqual(403, response.status_code)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(Conversation.objects.count(), 1)
        self.assertEqual(self.conversation.members.count(), 2)




