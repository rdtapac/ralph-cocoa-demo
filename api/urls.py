# from django.urls import path,
from django.conf.urls import url

from . import views

urlpatterns = [
    url('', views.index, name='index'),
    url('vending_machines', views.vending_machines, name='vending_machines'),
]