from django.shortcuts import render, redirect


def index(request):
	return redirect('album')

def album(request):
	return render(request, "main/album.html", {'title': 'Album'})

def update(request):
	return redirect('album')

def photo_detail(request):
	return render(request, "main/photo_detail.html", {'title': 'Photo'})
