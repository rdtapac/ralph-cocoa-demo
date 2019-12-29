from django.db import models

# Create your models here.

class VendingMachines(models.Model):
    managed = False

    def get_all(self):
        test_data = []

        test_data = [
            {
                "id": 241218,
                "brand": 'kirin',
                "lat": 35.69296,
                "long": 139.7007,
                "address": "〒160-0022 東京都新宿区新宿３丁目２３−１７"
            }
        ]

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