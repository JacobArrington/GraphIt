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
    

    

    mime_to_extension = {
        'text/csv': 'csv',
        
        'application/json': 'json'
    }

    file_extension = mime_to_extension.get(file_type)
    # reads file into DataFrame based on the file type
    df = None
    if file_extension == 'csv':
        file_as_string = blob.download_as_text()
        df = pd.read_csv(io.StringIO(file_as_string))
    
    elif file_extension == 'json':
        file_as_string = blob.download_as_text()
        df =pd.DataFrame(json.loads(file_as_string))
    else:
        raise ValueError("Unsupported file type")

    df = df.select_dtypes(include=['int32', 'object'])

   # Limit rows to 100 if there are more than 100 rows
    if df.shape[0] > 100:
        df = df.iloc[:100, :]

    #removes spases from string and captilizes them
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].str.replace(' ', '').str.capitalize()

    chart_data = df.to_dict(orient='records')
    return chart_data

   

   


@visualization_routes.route('', methods=['GET', 'POST'])
@login_required
def get_all_visualizations():
    if request.method =='GET':
        user_id = current_user.id
    
        
        public_visualizations = Visualization.query.filter(Visualization.visibility == 'public').all()
        public_vis_list = [{'type': 'public', **visualization.to_dict()} for visualization in public_visualizations]
        
        
        user_visualizations = Visualization.query.filter(Visualization.user_id == user_id).all()
        user_vis_list = [{'type': 'user', **visualization.to_dict()} for visualization in user_visualizations]
        
        
        return jsonify(public_vis_list + user_vis_list)
    
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
            views=data.get('views'),
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

    if visualization.visibility == 'private' and visualization.user_id != current_user.id:
        return jsonify({'error': 'Not authorized'}), 403

    if visualization.user_id == current_user.id and not visualization.owner_viewed:
        visualization.views += 1
        visualization.owner_viewed = True

    elif visualization.user_id != current_user.id:
        visualization.views += 1


    db.session.commit()

    return jsonify(visualization.to_dict())

    

@visualization_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_visualization(id):
    visualization = Visualization.query.get(id)

    if visualization.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'})
    
    data = request.get_json()
    # file = None
    
    # if 'date_file_id' in data:
    #     file = DataFile.query.get(data['data_file_id'])

    # if not file:
    #     return jsonify({'error': 'file not found'})
    
    chart_data = visualization.chart_data
    visualization.chart_data = chart_data

    visualization.visualization_type = data.get('visualization_type',visualization.visualization_type)
    visualization.title = data.get('title', visualization.title)
    visualization.description = data.get('description', visualization.description)
    visualization.visibility = data.get('visibility', visualization.visibility)
    visualization.color = data.get('color', visualization.color)
    visualization.width = data.get('width', visualization.width)
    visualization.height = data.get('height', visualization.height)
    visualization.updated_at = datetime.now()

    db.session.commit()

    return jsonify(visualization.to_dict())
    

@visualization_routes.route('/<int:id>', methods=['DELETE']) 
@login_required
def delete_visualization(id):
    visualization = Visualization.query.get(id)

    if visualization.user_id != current_user.id:
        return jsonify({'error':'Unauthorized'})  
    

    db.session.delete(visualization)
    db.session.commit()

    return jsonify({'message': 'Graph deleted successfully'})
