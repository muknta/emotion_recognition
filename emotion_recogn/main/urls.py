from django.urls import path
from . import views

urlpatterns = [
	path('', views.index, name="index"),
    path('album/', views.album, name="album"),
    path('album/update/', views.update, name="update"),
]
