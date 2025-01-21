import asyncio
from datetime import datetime, timezone
import random
import re
import string
from typing import Literal
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Form
from pydantic import EmailStr
from sqlalchemy.orm import Session
from .. import models, schemas, utils, oauth2
from ..database import engine, get_db
from ..config import settings
from website.logger.logger_init import logger_sys, logger_auth, logger_db
import time as t
import jwt  # pyjwt

router = APIRouter(
    prefix='/api',
    tags=['Registration']

)


@router.post("/user/", status_code=status.HTTP_201_CREATED)
async def create_user(username: str = Form(...),
                      email: EmailStr = Form(...),
                      password: str = Form(...),
                      db: Session = Depends(get_db)):

    lower_username = username.lower()
    # Check if user already exists
    existing_email = db.query(models.User).filter(
        models.User.email == email).first()
    existing_username = db.query(models.User).filter(
        models.User.username.ilike(lower_username)).first()

    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="This username or email is already taken.")
    elif existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="This username or email is already taken.")

    # Validate input
    utils.validate_username(username, max_length=5)
    utils.validate_email(email)
    utils.validate_password(password)

    # hash the password - user.password
    result = utils.hash(password)
    password, salt = result
    new_user = models.User(username=username,
                           email=email, password=password, salt=salt)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There was an error creating account, please contact us!"
        )
    return 'Success!'
