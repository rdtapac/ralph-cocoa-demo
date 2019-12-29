import os, json

from django.db import models
from django.conf import settings

# Create your models here.

class VendingMachines(models.Model):
    managed = False
    address_data = []

    def __init__(self):
        self.compose_data()



    def compose_data(self):
        address_json_filename = os.path.join(settings.BASE_DIR, 'api/json_data_folder' ,'vending_machine_address.json')
        address_file = open(address_json_filename, 'r')
        address_file_contents = address_file.read()
        address_file.close()
        self.address_data = json.loads(address_file_contents)



    def get_all(self):
        test_data = []

        test_data = self.address_data
        # test_data = [
        #     {
        #         "id": 241218,
        #         "lat": 35.6762,
        #         "long": 139.6503,
        #         "address": "〒160-0022 東京都新宿区新宿３丁目２３−１７"
        #     }
        # ]



        return test_data

    def get_per_layer(self, layer_id):
        pass

    def get_vending_machine_details(self, id):
        pass