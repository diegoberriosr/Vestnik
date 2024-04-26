from django.test import TestCase
from ..models import User

class TestUserModel(TestCase):
    def test_create_user(self):
        self.assertEqual(User.objects.count(), 0)

        user = User(email='testman@mail.com', name='Testman', password=12345)
        user.save()

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(user.email, 'testman@mail.com')
        self.assertEqual(user.name, 'Testman')