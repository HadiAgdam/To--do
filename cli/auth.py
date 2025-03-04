from hashlib import sha256
from math import floor
from time import time
from os import path
import constants


def load_auth():
    if path.exists(constants.AUTH_FILE):
        with open(constants.AUTH_FILE, "r") as f:
            return f.read().strip()
    return None


def hash_key(key: str):
    return None if key is None else sha256((key + str(floor(time() / 13))).encode()).hexdigest()
    


def get_key():
    return hash_key(load_auth())