import asyncio
from datetime import datetime, timezone
import json
import time as t
from typing import Literal
from fastapi import APIRouter, Depends, Form, status, HTTPException, Response, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
import jwt
from pydantic import EmailStr
from sqlalchemy import or_
from sqlalchemy.orm import Session
from .. import database, schemas, models, utils, oauth2
from website.logger.logger_init import logger_sys, logger_auth, logger_db
from ..config import settings
from ..database import get_db
from ..models import User

router = APIRouter(
    prefix='/api/login',
    tags=['Login']
)


@router.post('/', response_model=schemas.Token)
def login(response: Response,
          username: str = Form(...),
          password: str = Form(...),
          db: Session = Depends(database.get_db)):

    user = db.query(models.User).filter(
        or_(models.User.username == username, models.User.email == username)).first()

    if not user or utils.verify(password, user.password, user.salt) != True:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f'Invalid Credentials')

    # Create token
    logger_auth.debug(f'Authenticating user {user.id} successful!')
    access_token = oauth2.create_access_token(
        data={"user_id": user.id, "username": user.username})

    # Set cookie
    # response.set_cookie(key="access_token", value=access_token,
    #                     httponly=True, secure=True, samesite='Strict')
    # Delete cookie
    # response.delete_cookie(key="access_token")
    return {"access_token": access_token, "token_type": "bearer"}
