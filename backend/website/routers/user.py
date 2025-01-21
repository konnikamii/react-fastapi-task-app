from decimal import Decimal
import decimal
import re
from typing import List, Literal, Union
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Form
from pydantic import EmailStr
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas, utils, oauth2
from ..database import engine, get_db
from ..models import User
from website.logger.logger_init import logger_sys, logger_auth, logger_db
import time as t

router = APIRouter(
    prefix='/api',
    tags=['User']
)


# ---------------------------- User ----------------------------#


@router.get('/user/', response_model=schemas.UserOut)
def get_user(current_user: User = Depends(oauth2.get_current_user)):
    logger_sys.debug(f'Getting info for user {current_user.id}...')
    return current_user


@router.post('/users/', response_model=List[schemas.UserOut] | List[schemas.UsersTasksOut])
def get_user(request: schemas.UsersGet, db: Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    logger_sys.debug(f'Getting info for all users by {current_user.id}...')

    users_query = db.query(models.User)

    if request.type == 'default':
        users = users_query.all()
        return [user for user in users]
    else:
        users = users_query.options(joinedload(models.User.tasks)).all()
        return [schemas.UsersTasksOut(
            id=user.id,
            username=user.username,
            email=user.email,
            is_verified=user.is_verified,
            first_name=user.first_name,
            last_name=user.last_name,
            phone_number=user.phone_number,
            updated_at=user.updated_at,
            created_at=user.created_at,
            tasks=[task for task in user.tasks]
        ) for user in users]


# Password
@router.put("/change-password/")
def change_password(old_password: str = Form(...),
                    new_password: str = Form(...),
                    db: Session = Depends(get_db),
                    current_user: User = Depends(oauth2.get_current_user)):

    # Verify the old password
    logger_sys.debug('Verifying old password')
    if not utils.verify(old_password, current_user.password, current_user.salt):
        logger_sys.debug('Old password does not match. Raise exception')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Old password does not match.")

    # Check if the new password is the same as the old password
    logger_sys.debug(
        'Checking if new password is the same as the old password')
    if utils.verify(new_password, current_user.password, current_user.salt):
        logger_sys.debug(
            'New password is the same as the old password. Raise exception')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="New password must be different from the old password.")

    # Validate the new password
    logger_sys.debug('Validating new password')
    utils.validate_password(new_password)

    # Hash the new password
    logger_sys.debug('Hashing new password')
    hashed_password_and_salt = utils.hash(new_password)
    new_hashed_password = hashed_password_and_salt[0]
    new_salt = hashed_password_and_salt[1]

    # Update the user's password in the database
    logger_db.info('Updating user password in the database')
    current_user.password = new_hashed_password
    current_user.salt = new_salt
    db.commit()
    db.refresh(current_user)

    return "Password updated successfully!"
