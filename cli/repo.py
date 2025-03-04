from models import Revenge
import constants
from requests import post, get, delete



class RevenveRepo:
    def add_revenge(
            self,
            auth_key: str,
            revenge: Revenge
            ):
        response = post(f"{constants.API_BASE}/revenge", json=revenge.to_dict(), headers={"Authorization": auth_key})

        return response.status_code == 200


    def list_revenge(self, auth_key: str):
        respons = get(f"{constants.API_BASE}/revenge", headers={"Authorization": auth_key})

        if not respons.status_code == 200 or not respons.json():
            return False
        

        revenges = []

        for t in respons.json():
            revenges.append(Revenge(
                id=t['id'],
                name=t['name'],
                reason=t['reason'],
                vulnerabilities=t['vulnerabilities']
            ))
        

        return revenges


    def delete_revenge(self, auth_key: str, revenge_id: str):
        response = delete(f"{constants.API_BASE}/revenge/{revenge_id}", headers={"Authorization": auth_key})

        return response.status_code == 200

