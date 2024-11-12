from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("by-date", views.restaurants, name="restaurants")
]