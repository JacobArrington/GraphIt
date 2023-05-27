import os
import json
from google.oauth2.service_account import Credentials
from google.cloud import storage

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here (for production)
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL').replace('postgres://', 'postgresql://')
    SQLALCHEMY_ECHO = True
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    if 'GOOGLE_APPLICATION_CREDENTIALS_JSON' in os.environ:
        gcs_credentials_json = os.environ['GOOGLE_APPLICATION_CREDENTIALS_JSON']
        gcs_credentials_dict = json.loads(gcs_credentials_json)
        GOOGLE_CLOUD_STORAGE_CREDENTIALS = Credentials.from_service_account_info(gcs_credentials_dict)
    else:
        GOOGLE_CLOUD_STORAGE_CREDENTIALS = None

    if GOOGLE_CLOUD_STORAGE_CREDENTIALS:
        # Instantiate a storage client with explicit credentials
        STORAGE_CLIENT = storage.Client(credentials=GOOGLE_CLOUD_STORAGE_CREDENTIALS)
    else:
        STORAGE_CLIENT = None
