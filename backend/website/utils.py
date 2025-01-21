
import os
from cryptography.exceptions import InvalidKey
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
import re

from fastapi import HTTPException, status

# ----------------------------PASSWORD-HASH----------------------------#

byte_length = 64
cpu_memory_cost = 2**14
block_size = 8
parallelization = 1


def hash(password: str):
    salt = os.urandom(16)
    kdf = Scrypt(salt=salt, length=byte_length, n=cpu_memory_cost,
                 r=block_size, p=parallelization,)
    hashed_password = kdf.derive(bytes(password, 'utf-8'))
    return (hashed_password, salt)


# verify
def verify(password: str, hashed_password, salt):
    kdf = Scrypt(salt=salt, length=byte_length, n=cpu_memory_cost,
                 r=block_size, p=parallelization,)
    try:
        kdf.verify(bytes(password, 'utf-8'), hashed_password)
        return True
    except InvalidKey:
        return False

# ------------------------------PASSWORD------------------------------#


def validate_password(password: str) -> str:
    '''
    Makes sure the password matches the following criteria:
    - at least 8 characters
    - at least one lowercase letter: a-z 
    - at least one digit: 0-9 
    '''

    if len(password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Password should be at least 8 characters.")
    elif not re.search("[a-z]", password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password should contain at least one lowercase letter.")
    elif not re.search("[0-9]", password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password should contain at least one number.")


# ------------------------------USERNAME------------------------------#

def validate_username(username: str, max_length: int):
    """
    Makes sure the username matches the following criteria:
    - longer than specified length
    - only lower case letters and numbers
    """
    if len(username) < max_length:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Username should be at least {max_length} characters.")
    elif not re.match(r"^[a-z0-9]+$", username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Username can contain only lower case letters and numbers.")


# ------------------------------EMAIL------------------------------#

def validate_email(email: str):
    """
    Validates the email with regex
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid email format.")
