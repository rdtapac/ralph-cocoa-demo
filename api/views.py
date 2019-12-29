# from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import VendingMachines

# Create your views here.
def index(request):
    vending_machines = VendingMachines()
    return JsonResponse(vending_machines.get_all(), safe=False)

def vending_machines(request):
    vending_machines = VendingMachines()
    return JsonResponse(vending_machines.get_all(), safe=False)