from time import sleep
from auth import get_key

tmp = None
while True:
    t = get_key()
    if tmp != t:
        print(t)
        tmp = t
    sleep(1)
