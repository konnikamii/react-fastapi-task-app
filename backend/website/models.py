import uuid
from sqlalchemy import JSON, Boolean, Column, Index, Integer, String, ForeignKey, Numeric, Date, Table, Text, Time, Interval, LargeBinary, UniqueConstraint, BigInteger, Float
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, nullable=False)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    password = Column(LargeBinary, nullable=False)
    salt = Column(LargeBinary, nullable=False)
    first_name = Column(String, nullable=True, default=None)
    last_name = Column(String, nullable=True, default=None)
    phone_number = Column(Integer, nullable=True, default=None)

    tasks = relationship("Tasks", back_populates="owner", lazy="joined")
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, onupdate=text('now()'),
                        server_default=text('now()'))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text('now()'))


class Tasks(Base):
    __tablename__ = 'tasks'

    id = Column(BigInteger, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    completed = Column(Boolean, nullable=False)
    due_date = Column(Date, nullable=True)

    owner_id = Column(BigInteger, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    owner = relationship("User", back_populates="tasks")

    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, onupdate=text('now()'),
                        server_default=text('now()'))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text('now()'))


class Contacts(Base):
    __tablename__ = 'contacts'

    id = Column(BigInteger, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)

    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, onupdate=text('now()'),
                        server_default=text('now()'))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text('now()'))
