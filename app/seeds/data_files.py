from app.models import db, DataFile,User, environment, SCHEMA
from google.cloud import storage
from sqlalchemy.sql import text
from datetime import datetime
from app.config import Config
import os

def seed_datafiles():
   
    bucket =Config.STORAGE_CLIENT.get_bucket('graphit_bucket')
    folder ="Seeders/"

    ext_to_mime = {
        '.csv': 'text/csv',
        '.json': 'application/json'
    }
    user = User.query.get(3)
    blobs = bucket.list_blobs(prefix=folder)
    
    files = []
    for blob in blobs:
        #checking if it is a file and not a sub folder
        if not blob.name.endswith('/'):

            #grabing filename without folder prefix
            filename = blob.name.split('/')[-1]

            #geting file ext
            file_ext = os.path.splitext(filename)[1]

            #sets the mime type
            file_type = ext_to_mime.get(file_ext)

            #sets file path
            file_path = blob.name
            files.append((filename, file_type, file_path))
         
    
        for filename, file_type, file_path in files:
            datafile = DataFile(
                user_id=user.id,
                filename=filename,
                file_type=file_type,
                file_path=file_path,
                is_public = True,
                created_at=datetime.now(),
            )
            db.session.add(datafile)
    
    db.session.commit()

def undo_datafiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.data_files RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM data_files"))

    db.session.commit()
