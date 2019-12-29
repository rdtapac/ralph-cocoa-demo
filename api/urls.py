from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('vending_machines', views.vending_machines, name='vending_machines'),
]