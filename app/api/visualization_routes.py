from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Visualization, DataFile, db
from datetime import datetime
from google.cloud import storage
from app.config import Config
import io
import pandas as pd 
import json 


visualization_routes = Blueprint('visualizations', __name__)

def convert_to_chart(file_name, file_type):
    #file Prep
    storage_client = Config.STORAGE_CLIENT

    bucket_name ='graphit_bucket'
    blob_name = file_name

    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)
    file_as_string = blob.download_as_text()

    

    mime_to_extension = {
        'text/csv': 'csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/json': 'json'
    }

    file_extension = mime_to_extension.get(file_type)
    # reads file into DataFrame based on the file type
    if file_extension == 'csv':
        df = pd.read_csv(io.StringIO(file_as_string))
    elif file_extension == 'xlsx':
        df = pd.read_excel(io.BytesIO(blob.download_as_bytes()))
    elif file_extension == 'json':
        df =pd.DataFrame(json.loads(file_as_string))
    else:
        raise ValueError("Unsupported file type")

 

    chart_data = []

    #converts each row to a dict
    for index, row in df.iterrows():
        row_dict = row.to_dict()
        chart_data.append(row_dict)

    return chart_data






@visualization_routes.route('', methods=['GET', 'POST'])
@login_required
def get_all_visualizations():
    if request.method =='GET':
        visualizations = Visualization.query.filter(Visualization.user_id == current_user.id).all()
        return jsonify([visualization.to_dict() for visualization in visualizations])
    
    elif request.method == 'POST':
        data = request.get_json()

        file = DataFile.query.get(data['data_file_id'])

        if not file:
            return jsonify({"error": "file not found"})
        
        chart_data = convert_to_chart(file.file_path, file.file_type)

        visualization = Visualization(
            user_id = current_user.id,
            data_file_id = data['data_file_id'],
            visualization_type=data['visualization_type'],
            title=data['title'],
            description=data['description'],
            visibility=data['visibility'],
            color=data.get('color'),
            width=data.get('width'),
            height=data.get('height'),
            chart_data=chart_data,
            created_at = datetime.now(),
            updated_at = datetime.now()

        )
        db.session.add(visualization)
        db.session.commit()

        return jsonify(visualization.to_dict())

       
@visualization_routes.route('/<int:id>')
@login_required
def visualization_by_id(id):
    visualization = Visualization.query.get(id)

    if visualization.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'})
    

    return jsonify(visualization.to_dict())

    
