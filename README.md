



# To--do List


This project started as a joke between me and my friend: "Let's create a revenge list to hack them one by one after Konkur exam".
It's actually a **to-do list with encryption**, built using **Cloudflare Workers**.

  

## Features

- **Secure Authentication**: Uses a rolling password system where the key is hashed with secret_key and`int(time/13)`, changing every 13 seconds.

- **Cloudflare Workers**: The server runs on Cloudflare Workers with KV storage.

- **Python Interface**: A simple CLI interface.

- **Structured Codebase**: Organized modules for easy maintenance.

  

## Authentication

A private key is stored in my device and in the Workers secrets. The rolling password mechanism ensures security by generating a new password every 13 seconds. Every request requires this key.

  

---

  

## Client Structure

```plaintext

📦 revenge-todo client

├── auth.py # Responsible for loading and encrypting the key

├── client.py # Terminal interface for interacting with the server

├── constants.py # Stores server address and key file path

├── models.py # Data models

├── repo.py # Handles communication with the server

└── README.md # Project documentation

```

  

---

  

## Code Overview

  

### `models.py`

```python

class Revenge:

  def __init__(self, name: str, reason: str, vulnerabilities: str, id: str = None):
    self.name = name
    self.reason = reason
    self.vulnerabilities = vulnerabilities
    self.id = id

  

  def to_dict(self) -> dict:
    return {
      "id": self.id,
      "name": self.name,
      "reason": self.reason,
      "vulnerabilities": self.vulnerabilities
    }

```

  

### `repo.py`

```python

import constants

import requests

from models import Revenge

  

  class RevengeRepo:
  
  def add_revenge(self, auth_key: str, revenge: Revenge):
    response = requests.post(f"{constants.API_BASE}/revenge", json=revenge.to_dict(), headers={"Authorization": auth_key})
    return response.status_code == 200
  
    
  
  def list_revenge(self, auth_key: str):
    response = requests.get(f"{constants.API_BASE}/revenge", headers={"Authorization": auth_key})
  
    if response.status_code != 200 or not response.json():
      return False
  
    revenges = [Revenge(id=t['id'], name=t['name'], reason=t['reason'], vulnerabilities=t['vulnerabilities']) for t in response.json()]
  
    return revenges
  
    
  
  def delete_revenge(self, auth_key: str, revenge_id: str):
  
    response = requests.delete(f"{constants.API_BASE}/revenge/{revenge_id}", headers={"Authorization": auth_key})
    return response.status_code == 200

```

  

## Disclaimer

This project is purely for fun and educational purposes. Do not use it for illegal activities.
