import json
import time as t
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from website.logger.logger_init import logger_sys, logger_auth, logger_db
from .. import database, schemas, models, utils, oauth2
from ..models import User
from ..config import settings
from ..database import get_db
from sqlalchemy import asc, desc


router = APIRouter(
    prefix='/api',
    tags=['Tasks']
)


@router.get('/task/{id}', response_model=schemas.TaskOut)
def get_task(id: int, db: Session = Depends(database.get_db), current_user: User = Depends(oauth2.get_current_user)):
    logger_auth.debug(f'Fetching task {id} for user {
                      current_user.id} ...')
    result = db.query(models.Tasks).filter(
        models.Tasks.owner_id == current_user.id, models.Tasks.id == id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return result


@router.post('/task/', status_code=status.HTTP_201_CREATED)
def create_task(request: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: User = Depends(oauth2.get_current_user)):
    logger_auth.debug(f'Creating task for user {current_user.id} ...')
    new_task = models.Tasks(
        title=request.title,
        description=request.description,
        completed=request.completed,
        due_date=request.due_date,
        owner_id=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return 'Successfully created task'


@router.put('/task/{id}')
def update_task(id: int, request: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: User = Depends(oauth2.get_current_user)):
    logger_auth.debug(f'Updating task {id} for user {current_user.id} ...')
    task_query = db.query(models.Tasks).filter(
        models.Tasks.owner_id == current_user.id, models.Tasks.id == id)
    task = task_query.first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    task_query.update(request.model_dump(), synchronize_session=False)
    db.commit()
    return 'Successfully updated task'


@router.delete('/task/{id}')
def delete_task(id: int, db: Session = Depends(database.get_db), current_user: User = Depends(oauth2.get_current_user)):
    logger_auth.debug(f'Deleting task {id} for user {current_user.id} ...')
    task_query = db.query(models.Tasks).filter(
        models.Tasks.owner_id == current_user.id, models.Tasks.id == id)
    task = task_query.first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    task_query.delete(synchronize_session=False)
    db.commit()
    return 'Successfully deleted task'


@router.post('/tasks/', response_model=schemas.TasksOut)
def get_tasks(request: schemas.TasksGet, db: Session = Depends(database.get_db), current_user: User = Depends(oauth2.get_current_user)):
    logger_auth.debug(f'Creating task for user {current_user.id} ...')

    # Determine sorting order
    sort_order = asc if request.sort_type == "asc" else desc
    sort_column = getattr(models.Tasks, request.sort_by)

    # Query tasks with pagination and sorting
    tasks_query = db.query(models.Tasks).filter(
        models.Tasks.owner_id == current_user.id)
    total_tasks = tasks_query.count()
    tasks = tasks_query.order_by(sort_order(sort_column)).offset(
        (request.page - 1) * request.page_size).limit(request.page_size).all()

    return schemas.TasksOut(total_tasks=total_tasks, tasks=tasks)
