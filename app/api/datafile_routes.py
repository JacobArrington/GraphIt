from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app.models import User, DataFile, db
from datetime import datetime
from .cloud_storage import upload_file_to_gcs
import os

datafile_routes = Blueprint('files',__name__)

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
            file_path=public_url,  # we store the public URL instead of local file path
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

    if not file:
        return jsonify({"error": "Data file not found"}), 404

    if file.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify(file.to_dict())
