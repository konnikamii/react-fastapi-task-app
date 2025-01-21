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
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings

router = APIRouter(
    prefix='/api/contact',
    tags=['Contacts']
)


# ---------------------------- User ----------------------------#


@router.post('/',  status_code=status.HTTP_201_CREATED)
def get_user(name: str = Form(...),
             email: EmailStr = Form(...),
             subject: str = Form(...),
             message: str = Form(...), db: Session = Depends(get_db)):
    logger_sys.debug(f'Creating contact...')

    # Validate input
    if not name or len(name) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Name is required.")
    if not subject or len(subject) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Subject is required.")
    if not message or len(message) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Message is required.")
    if len(name) > 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Name should be less than 200 characters.")
    if len(email) > 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email should be less than 200 characters.")
    if len(subject) > 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Subject should be less than 200 characters.")
    if len(message) > 1500:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Message should be less than 1500 characters.")

    # Add entry
    new_contact = models.Contacts(
        name=name,
        email=email,
        subject=subject,
        message=message
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    # Send email to MailHog
    try:
        sender_email = "no-reply@example.com"
        receiver_email = "test@example.com"
        subject = subject
        body = f"Name: {name}\nEmail: {email}\n\n{message}"

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP("mailhog" if settings.run_on_docker == 'on' else 'localhost', 1025) as server:
            server.sendmail(sender_email, receiver_email, msg.as_string())

        return {"detail": 'Message sent!'}
    except Exception as e:
        logger_sys.error(f"Failed to send email: {e}")
        return {"detail": 'Message saved to db!'}
