from django.shortcuts import render, redirect, render_to_response
from django.conf import settings
from main.twelve_threads import *


def index(request):
	return render(request, "main/index.html", {'title': 'Main'})

def album(request):
	return render(request, "main/album.html", {'title': 'Album'})

def update(request):
	multi_start(settings.DATABASE_URL)
	return redirect('album')
