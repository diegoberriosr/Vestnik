import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'chat_{self.user_id}'

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print('receiving')
        data = json.loads(text_data)
        type = data['type']
        receiver_ids = data['receiver_ids']
        conversation_id = data['conversation_id']

        for receiver_id in receiver_ids:
               print(f'sending to {receiver_id}')
               await self.channel_layer.group_send(
                f'chat_{receiver_id}', {
                    'type' : type,
                    'message_id' : data['message_id'],
                    'conversation_id' : conversation_id
                }
            )

    async def new_message(self, event):
        print('on custom send')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'message_id' : event['message_id'],
            'conversation_id' : event['conversation_id']
        }))


    async def delete_message(self, event):
        print('on custom delete')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'message_id' : event['message_id'],
            'conversation_id' : event['conversation_id'],
        }))

    async def update_group_admin(self, event):
        pass

    async def update_group_member(self, event):
        pass

    async def update_group_name(self, event):
        pass

    async def typing_alert(self, event):
        pass