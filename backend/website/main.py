
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import login, register,  auth, user, tasks, contact

from website.logger.logger_init import logger_sys, logger_auth, logger_db

# generate database but no need with alembic
# models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:7000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# app.include_router(post.router)
app.include_router(register.router)
app.include_router(login.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(tasks.router)
app.include_router(contact.router)

logger_sys.info('Server started up and running')


@app.get("/api/")
def root():
    return {"Hello": "World"}


# if __name__ == "__main__":
#     uvicorn.run(app, host='0.0.0.0', port=8000)
