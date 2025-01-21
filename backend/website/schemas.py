import random
from decimal import Decimal
from typing import Dict, List, Literal, Optional
from fastapi import Form
from pydantic import BaseModel, ConfigDict, EmailStr, condecimal, conint, Field
from datetime import time, datetime, date, timedelta

# Type aliases
UsersGetType = Literal['default', 'user_tasks']
SortByType = Literal["title", "due_date",
                     "completed", "created_at", "updated_at"]
SortTypeType = Literal["asc", "desc"]


# ---------------------------- Global Config ----------------------------#
class BaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------------------------- Auth ----------------------------#
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: int
    username: str


# ---------------------------- User ----------------------------#
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_verified: bool
    phone_number: int | None = None
    updated_at: datetime
    created_at: datetime


# ---------------------------- Tasks ----------------------------#
class TasksGet(BaseModel):
    page: int
    page_size: int
    sort_by: SortByType
    sort_type: SortTypeType


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    due_date: date | None
    owner_id: int
    updated_at: datetime
    created_at: datetime


class TasksOut(BaseModel):
    total_tasks: int
    tasks: List[TaskOut]


class TaskCreate(BaseModel):
    title: str
    description: str
    completed: bool
    due_date: date | None


# ---------------------------- Users ----------------------------#
class UsersGet(BaseModel):
    type: UsersGetType


class UsersTasksOut(UserOut):
    tasks: List[TaskOut]
