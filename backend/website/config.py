from pydantic_settings import BaseSettings, SettingsConfigDict
import os

DOTENV = os.path.join(os.path.dirname(__file__), "../.env")


class Settings(BaseSettings):
    # DB
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str

    run_on_docker: str

    # JWT
    algorithm: str
    encryption_password_private_key: str
    access_token_expire_minutes: int

    model_config = SettingsConfigDict(env_file=DOTENV)


settings = Settings()
