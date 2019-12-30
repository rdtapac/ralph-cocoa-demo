import os, json

from django.db import models
from django.conf import settings

# Create your models here.

class VendingMachines(models.Model):
    managed = False
    address_data = []
    vending_machine_data = []
    parsed_data = []

    def __init__(self):
        self.compose_data()


    def compose_data(self):

        try:
            address_json_filename = os.path.join(settings.BASE_DIR, 'api/json_data_folder',
                                                 'vending_machine_address.json')
            address_file = open(address_json_filename, 'r')
            address_file_contents = address_file.read()
            address_file.close()
            self.address_data = json.loads(address_file_contents)

            # TODO :: separate reading and storing json files to another method, this is repetiitive
            vending_machine_info_json_filename = os.path.join(settings.BASE_DIR, 'api/json_data_folder',
                                                 'vending_machine_info.json')
            vending_machine_file_file = open(vending_machine_info_json_filename, 'r')
            vending_machine_file_contents = vending_machine_file_file.read()
            vending_machine_file_file.close()
            self.vending_machine_data = json.loads(vending_machine_file_contents)

            for machine_address_elem in self.address_data:
                parsed_elem = machine_address_elem
                vending_machine_id = str(machine_address_elem["id"])
                vending_machine_info  = self.vending_machine_data[vending_machine_id]
                parsed_elem["vending_machine_info"] = vending_machine_info
                self.parsed_data.append(parsed_elem)

        except Exception as e:
            pass


    def get_all(self):
        return self.parsed_data

    def get_per_layer(self, layer_id):
        pass

    def get_vending_machine_details(self, id):
        pass