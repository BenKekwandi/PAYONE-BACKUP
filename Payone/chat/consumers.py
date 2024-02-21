import json

from django.contrib.sessions.middleware import SessionMiddleware
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from channels.generic.websocket import AsyncWebsocketConsumer

class WebSocketAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Add session data to the scope
        SessionMiddleware().process_request(scope)
        scope['user'] = scope.get('session', {}).get('_auth_user_id')
        return await super().__call__(scope, receive, send)
    
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        user = self.scope['user']
        if user == AnonymousUser:
            # Unauthorized, close the connection
            await self.close()
        else:
            
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
            self.room_group_name = f"chat_{self.room_name}"

            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))