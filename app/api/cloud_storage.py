from google.cloud import storage
from flask import request
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

    return blob.name

def download_file_from_gcs(file_path):
    bucket_name ='graphit_bucket'
    url = f'https://storage.googleapis.com/{bucket_name}/{file_path}'
    response = request.get(url)
    return response.text
