from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app.models import User, DataFile, db
from datetime import datetime
from .visualization_routes import convert_to_chart
from .cloud_storage import upload_file_to_gcs, download_file_from_gcs
import os

datafile_routes = Blueprint('files',__name__)

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
        files = DataFile.query.filter(DataFile.user_id == current_user.id).all()
        return jsonify([file.to_dict() for file in files])
    
    elif request.method == 'POST':
     if 'file' not in request.files:
        return jsonify({'error': 'No file in the request'}),400
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No seleceted file'}), 400
    
    filename = secure_filename(file.filename)

    upload_dir = current_app.config['UPLOAD_FOLDER']

    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'],filename)

    file.save(file_path)
    public_url = upload_file_to_gcs(file_path, filename)

    print(f'Public URL after upload: {public_url}')

    path = public_url.replace(f"https://storage.googleapis.com/{current_app.config['GCS_BUCKET']}/", '')

    print(f'Relative path for GCS: {path}')

    os.remove(file_path)
    mime_to_type = {
    'text/csv': 'csv',
    'application/json': 'json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
}

    datafile = DataFile(
            user_id=current_user.id,
            filename=filename,
            file_type='text/csv' if file.mimetype == 'csv' else file.mimetype,
            file_path=path , 
            created_at=datetime.now()
        )
    print(datafile,'@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    db.session.add(datafile)
    db.session.commit()

    return jsonify(datafile.to_dict()), 201


@datafile_routes.route('/<int:id>')
@login_required
def file_by_id(id):
    file = DataFile.query.get(id)
    print(f'Stored file path in database: {file.file_path}')

    if not file:
        return jsonify({"error": "Data file not found"}), 404

    if file.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    file_data = get_data_from_cloud(file.filename)

    response = file.to_dict()
    response['data'] = file_data

    return jsonify(response)
    
   
