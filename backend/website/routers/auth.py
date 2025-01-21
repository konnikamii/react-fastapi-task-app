import json
import time as t
from fastapi import APIRouter, Cookie, Depends, status, HTTPException, Response, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from website.logger.logger_init import logger_sys, logger_auth, logger_db
from .. import database, schemas, models, utils, oauth2
from ..models import User
from ..config import settings
from ..database import get_db


router = APIRouter(
    prefix='/api/auth',
    tags=['Authenticate']
)


@router.post('/')
def auth(current_user: User = Depends(oauth2.get_current_user)):
    logger_auth.debug(f'Authenticating user {current_user.id} successful.')

    return "Valid Token."
