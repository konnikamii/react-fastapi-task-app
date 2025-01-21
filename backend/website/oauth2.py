import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import smtplib
from typing import Literal
from cryptography.hazmat.primitives.serialization import load_pem_private_key, load_pem_public_key
import jwt  # pyjwt
from jwt.exceptions import InvalidTokenError  # pyjwt
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from fastapi import Cookie, Depends, Request, status, HTTPException
from . import schemas, database, models
from datetime import datetime, timedelta, timezone
from .config import settings
import aiosmtplib
import random

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="./api/login")

ALGORITHM = settings.algorithm
ENCRYPTION_PASSWORD_PRIVATE_KEY = settings.encryption_password_private_key

ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

# ROOT_PATH = settings.root_path
ROOT_PATH = os.path.join(os.path.dirname(__file__), '..')


# Load the private key from a PEM file
with open(f'{ROOT_PATH}/keys/private_key.pem', 'rb') as key_file:
    private_key_pem = key_file.read()
    private_key = load_pem_private_key(
        private_key_pem, password=ENCRYPTION_PASSWORD_PRIVATE_KEY.encode('utf-8'))


def create_access_token(data: dict):
    data_to_encode = data.copy()
    exp_time = ACCESS_TOKEN_EXPIRE_MINUTES
    expire = datetime.now(timezone.utc) + \
        timedelta(minutes=int(exp_time))
    data_to_encode.update({"exp": expire})

    # Sign the JWT with your Ed25519 private key
    encoded_jwt = jwt.encode(
        data_to_encode, private_key, algorithm=ALGORITHM)

    return encoded_jwt


# Load the public key from a PEM file
with open(f'{ROOT_PATH}/keys/public_key.pem', 'rb') as key_file:
    public_key_pem = key_file.read()
    public_key = load_pem_public_key(public_key_pem)


# Verify the JWT
def verify_access_token(token: str, credentials_exception: HTTPException):
    try:
        # Sign the JWT with your Ed25519 public key
        payload = jwt.decode(token, public_key, algorithms=[ALGORITHM])

        id: str = payload.get('user_id')
        username: str = payload.get('username')

        if id is None:
            raise credentials_exception
        token_data = schemas.TokenData(id=id, username=username)
    except InvalidTokenError:
        raise credentials_exception

    return token_data


class Cookies(BaseModel):
    access_token: str | None


# Get user with header Cookie
# def get_current_user(access_token: Cookies = Cookie(), db: Session = Depends(database.get_db)):

# Get user with header Authorization
def get_current_user(access_token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail=f"Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

    if not access_token:
        raise credentials_exception

    token_data = verify_access_token(access_token, credentials_exception)
    user = db.query(models.User).filter(
        models.User.id == token_data.id).first()

    if not user:
        raise credentials_exception

    return user
