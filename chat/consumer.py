from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json
from .models import Message
from .views import get_last_10_messages, get_user_contact, get_current_chat

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):
        print(data)
        # Call this method here to get_last_10_messages()
        # based on the ID of teh chat that's being connected to.
        messages = get_last_10_messages(data['chatId'])
        print(data['chatId'])
        print(messages)   # QuerySet [<Message: A>, <Message: B>]
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }

        self.send_message(content)
        print("Hi there {}".format(content))

    # Show user name, and filter what messages does user
    # sent messages
    # And Confirm how many messages have been sent.
    def new_message(self, data):
        # User Logged in
        user_contact = get_user_contact(data['from'])
        print("Testing...")
        print(user_contact)
        # Passed in Username and filter the User objects by that
        # Username
        # author_user = User.objects.filter(username=user_contact)[0]
        message = Message.objects.create(
            contact=user_contact,
            content=data['message'])
        print(message)
        current_chat = get_current_chat(data['chatId'])
        current_chat.messages.add(message)
        current_chat.save()
        # This is the one messages, so we gets
        # Singular version, which function
        # named message_to_json()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    # Create JSON version to make sure send each messages
    # to another users.
    # Show Messages result not a singular message
    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    # Show who sent the messages by 10 seconds and
    # show time as a string value.
    def message_to_json(self, message):
        print(message.contact.user.username)
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp),
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)
        print(data['command'])

    def send_chat_message(self, message):
        # message = data['message']
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))
