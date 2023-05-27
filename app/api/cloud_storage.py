from google.cloud import storage
from google.oauth2.service_account import Credentials
from  app.config import Config
import json
import os

def upload_file_to_gcs(file, file_name):

  

    # Get the GCS bucket
    bucket = Config.STORAGE_CLIENT.get_bucket('graphit_bucket')

    # Define the blob (file) name
    blob = bucket.blob(file_name)

    with open(file, 'rb') as f:
        blob.upload_from_file(f)

    return blob.public_url
