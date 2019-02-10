from django.shortcuts import render, redirect, render_to_response
from django.conf import settings
from main.album_download import *
from main.face_nice import *
from main.twelve_threads import *
import _thread
import time


def index(request):
	return render(request, "main/index.html", {'title': 'Main'})

def album(request):
	return render(request, "main/album.html", {'title': 'Album'})

def update(request):
	render_to_response("main/update.html", {'title': 'UPDATING'})
	multi_start(settings.DATABASE_URL)
	return redirect('album')

def photo_detail(request):
	return render(request, "main/photo_detail.html", {'title': 'Photo'})
