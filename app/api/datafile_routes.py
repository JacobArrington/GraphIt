from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app.models import User, DataFile, db
from datetime import datetime
from .visualization_routes import convert_to_chart
from .cloud_storage import upload_file_to_gcs, download_file_from_gcs
import os
import pandas as pd 
import numpy as np 

datafile_routes = Blueprint('files',__name__)

ALLOWED_MIME_TYPES = ['text/csv', 'application/json']

def has_valid_dtypes(file_path, int_dtype=np.int32, str_dtype=np.object):
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.json'):
        df = pd.read_json(file_path)
    else:
        return False, "Invalid file format"
    
    has_int = any(df[column].dtype == int_dtype for column in df.columns)
    has_str = any(df[column].dtype == str_dtype for column in df.columns)

    if has_int and has_str:
        return True, "Valid file"
    else:
        missing_types = []
        if not has_int:
            missing_types.append("int32")
        if not has_str:
            missing_types.append("string")
        return False, f"File is missing columns with these data types: {', '.join(missing_types)}"

def get_data_from_cloud(file_id):
    datafile = DataFile.query.get(file_id)
    if not datafile:
        return None
    
    chart_data = convert_to_chart(datafile.file_path, datafile.file_type)

    return chart_data


@datafile_routes.route('',methods=['GET', 'POST'])
@login_required
def get_all_files():
    if request.method == 'GET':
        owned_files = DataFile.query.filter(DataFile.user_id == current_user.id).all()

        public_files = DataFile.query.filter(DataFile.is_public == True).all()

        files = owned_files + [file for file in public_files if file not in owned_files]
        return jsonify([file.to_dict() for file in files])
    
    elif request.method == 'POST':
     if 'file' not in request.files:
        return jsonify({'error': 'No file in the request'}),400
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No seleceted file'}), 400
    
    if file.mimetype not in ALLOWED_MIME_TYPES:
        return jsonify({'error': 'File type not allowed. Please upload a JSON or CSV file.'}), 400
    
    filename = secure_filename(file.filename)

    upload_dir = current_app.config['UPLOAD_FOLDER']

    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'],filename)

    file.save(file_path)

    is_valid, message = has_valid_dtypes(file_path)
    if not is_valid:
        os.remove(file_path)
        return jsonify({'error': message}), 400

   
    public_url = upload_file_to_gcs(file_path, filename)
    path = public_url.replace(f"https://storage.googleapis.com/{current_app.config['GCS_BUCKET']}/", '')

    
    os.remove(file_path)
    mime_to_type = {
    'text/csv': 'csv',
    'application/json': 'json',
    
}
    is_public = request.form.get('is_public', type=bool, default=False)

    datafile = DataFile(
            user_id=current_user.id,
            filename=filename,
            file_type='text/csv' if file.mimetype == 'csv' else file.mimetype,
            file_path=path , 
            is_public=is_public,
            created_at=datetime.now()
        )
    
    db.session.add(datafile)
    db.session.commit()

    return jsonify(datafile.to_dict()), 201


@datafile_routes.route('/<int:id>')
@login_required
def file_by_id(id):
    file = DataFile.query.get(id)
    

    if not file:
        return jsonify({"error": "Data file not found"}), 404

    if file.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    file_data = get_data_from_cloud(file.filename)

    response = file.to_dict()
    response['data'] = file_data

    return jsonify(response)
    
   
@datafile_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_file(id):

    file = DataFile.query.get(id)

    if not file:
        return jsonify({"error": "file not found"}), 404

    if file.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    #print(f'Incoming data: {data}') 
    #print(f'Current is_public value: {file.is_public}')
    
    file.filename= data.get('filename', file.filename)
    
    file.is_public = data.get('isPublic', file.is_public)
    #print(f'New is_public value: {file.is_public}')
    file.updated_at = datetime.now()

    db.session.commit()

    return jsonify(file.to_dict()), 200
    

@datafile_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_file(id):
    file = DataFile.query.get(id)

    if not file:
        return jsonify({"error": "file not found"}),404
    
    if file.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}),403
    
    db.session.delete(file)
    db.session.commit()

    return jsonify({'message': 'File successfully deleted'})
