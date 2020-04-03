from rest_framework import serializers

from ..models import Chat
from ..views import get_user_contact


class ContactSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class ChatSerializer(serializers.ModelSerializer):
    participants = ContactSerializer(many=True)

    class Meta:
        model = Chat
        fields = ('id', 'messages', 'participants')

    def create(self, validated_data):
        print(validated_data)
        participants = validated_data.pop('participants')
        chat = Chat()
        chat.save()
        for username in participants:
            # Use the contact method by passing in the username
            # and that will give us their contact object and we add that
            # into the chat and we add all participants that were
            # passed in and then save the chat and return it.
            contact = get_user_contact(username)
            chat.participants.add(contact)
        chat.save()
        return chat


# Do in Python Shell to see how to serializer data


# from chat.models import Chat
# from chat.api.serializers import ChatSerializer
# chat = Chat.objects.get(id=1)
# s = ChatSerializer(instance=chat)
# s
# s.data
