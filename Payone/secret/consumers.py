import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .controllers.api import exchangeRates  # Import your asynchronous view

class exchangeRatesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Handle incoming WebSocket messages, if needed
        pass

    async def update_message(self, event):
        message = event['message']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({'message': message}))