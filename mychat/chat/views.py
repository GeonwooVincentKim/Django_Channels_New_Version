from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from .models import Chat, Contact

User = get_user_model()


def get_last_10_messages(chatId):
    print("last 10_messages")
    chat = get_object_or_404(Chat, id=chatId)
    print("Chat Number : {}".format(chat))
    return chat.messages.order_by('-timestamp').all()[:10]


def get_user_contact(username):
    print("user_contact")
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contact, user=user)


def get_current_chat(chatId):
    print("current_data")
    return get_object_or_404(Chat, id=chatId)
