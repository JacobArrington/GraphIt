from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, DataFile, db
from datetime import datetime

datafile_routes = Blueprint('files',__name__)

@datafile_routes.route('',methods=['GET', 'POST'])
@login_required
def get_all_files():
    if request.method == 'GET':
        files = DataFile.query.filter(DataFile.user_id == current_user.id).all()
        return jsonify([file.to_dict() for file in files])
    
    elif request.method == 'POST':
        data = request.get_json()
        print(f"Request data: {data}")
        if 'filename' not in data or 'file_type' not in data or 'file_path'not in data:
            return jsonify({"error": "missing fields"})
        
        file = DataFile(
            user_id=current_user.id,
            filename=data['filename'],
            file_type=data['file_type'],
            file_path=data['file_path'],
            created_at=datetime.now()
        )
        db.session.add(file)
        db.session.commit()

        return jsonify(file.to_dict()) , 201


@datafile_routes.route('/<int:id>')
@login_required
def file_by_id(id):
    file = DataFile.query.get(id)

    if not file:
        return jsonify({"error": "Data file not found"}), 404

    if file.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify(file.to_dict())
