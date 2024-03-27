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

        for receiver_id in receiver_ids:
               print(f'sending to {receiver_id}')
               if (type == 'update_group_admin'):
                   await self.channel_layer.group_send(
                    f'chat_{receiver_id}', {
                    'type' : type,
                    'conversation_id' : data['conversation_id'],
                    'target_id' : data['target_id'],
                     })      
               elif  type == 'remove_member':
                   await self.channel_layer.group_send(
                    f'chat_{receiver_id}', {
                    'type' : type,
                    'conversation_id' : data['conversation_id'],
                    'target_id' : data['target_id'],
                    'target_name' : data['target_name']
                     })  

               elif type == 'add_members':
                   print(data['target_ids'])
                   await self.channel_layer.group_send(
                    f'chat_{receiver_id}', {
                    'type' : type,
                    'conversation_id' : data['conversation_id'],
                    'target_ids' : data['target_ids'],
                     })                  

               elif type == 'update_group_name':
                   await self.channel_layer.group_send(
                    f'chat_{receiver_id}', {
                    'type' : type,
                    'conversation_id' : data['conversation_id'],
                    'new_name' : data['new_name'],
                     })   
                   
               elif type == 'update_unseen_messages':
                   await self.channel_layer.group_send(
                       f'chat_{receiver_id}', {
                           'type' : type,
                           'conversation_id' : data['conversation_id']
                       }
                   )

               elif type == 'typing_alert':
                    await self.channel_layer.group_send(
                        f'chat_{receiver_id}', {
                            'type' : type,
                            'conversation_id' : data['conversation_id'],
                            'origin_id' : data['origin_id']
                        }
                    )

               elif type == 'online_status_update':
                   await self.channel_layer.group_send(
                       f'chat_{receiver_id}', {
                           'type' : type,
                           'origin_id' : data['origin_id']
                       }
                   )
                                                        
               else:
                   await self.channel_layer.group_send(
                     f'chat_{receiver_id}', {
                    'type' : type,
                    'message_id' : data['message_id'],
                    'conversation_id' : data['conversation_id'],
                    })

    async def new_message(self, event):
        print('on custom send')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'message_id' : event['message_id'],
            'conversation_id' : event['conversation_id'],
        }))


    async def delete_message(self, event):
        print('---- message deletion -----')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'message_id' : event['message_id'],
            'conversation_id' : event['conversation_id'],
        }))

    async def update_group_admin(self, event):
        print('updating admin')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'conversation_id' : event['conversation_id'],
            'target_id' : event['target_id'],
        }))

    async def remove_member(self, event):
        print('removing member')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'conversation_id' : event['conversation_id'],
            'target_id' : event['target_id'],
            'target_name' : event['target_name']
        }))

    async def add_members(self, event):
        print('adding member(s)')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'conversation_id' : event['conversation_id'],
            'target_ids' : event['target_ids']
        }))

    async def update_group_name(self, event):
        print('changing group name')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'conversation_id' : event['conversation_id'],
            'new_name' : event['new_name']
        }))


    async def typing_alert(self, event):
        print('typing alert')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'conversation_id' : event['conversation_id'],
            'origin_id' : event['origin_id']
        }))


    async def update_unseen_messages(self, event):
        print('updating seen status')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'conversation_id' : event['conversation_id']
        }))

    async def online_status_update(self, event):
        print('updating online status')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'origin_id' : event['origin_id']
        }))