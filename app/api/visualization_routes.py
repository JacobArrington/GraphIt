from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Visualization, DataFile, db
from datetime import datetime
import pandas as pd 
import json 


visualization_routes = Blueprint('visualizations', __name__)

def convert_to_chart(file_path, file_type, chart_type):
    # reads file into DataFrame based on the file type
    if file_type == 'csv':
        df = pd.read_csv(file_path)
    elif file_type == 'xlsx':
        df = pd.read_excel(file_path)
    elif file_type == 'json':
        # handling it with json for more flexabilty of file structure the converting to a dataframe
        with open(file_path, 'r') as file:
            data = json.load(file)
        df = pd.DataFrame(data) 
    else:
        raise ValueError("Unsupported file type")

    #min-max scaling
    for column in df.select_dtypes(include=['int', 'float']).columns:
        df[column] =(df[column].min()) / (df[column].max() -df[column].min())

    chart_data = []

    #converts each row to a dict
    for index, row in df.iterrows():
        row_dict = row.to_dict()
        chart_data.append(row_dict)

    return chart_data






@visualization_routes.route('', methods=['GET, POST'])
@login_required
def get_all_visualizations():
    if request.method =='GET':
        visualizations = Visualization.query.filter(Visualization.user_id == current_user.id).all()
        return jsonify([visualization.to_dict() for visualization in visualizations])
    
    elif request.method == 'POST':
        data = request.get_json()

        file = DataFile.query.get(data['file_id'])

        if not file:
            return jsonify({"error": "file not found"})
        
        chart_data = convert_to_chart(file.file_path, file.file_type)

        visualization = Visualization(
            user_id = current_user.id,
            data_file_id = data['data_file_id'],
            visualization_type=data['visualization_type'],
            title=data['title'],
            visibility=data['visibility'],
            color=data.get('color'),
            size=data.get('size'),
            chart_data=chart_data,
            created_at = datetime.now()

        )
        db.session.add(visualization)
        db.session.commit()

        return jsonify(visualization.to_dict)

       
@visualization_routes.route('/<int:id>')
@login_required
def visualization_by_id(id):
    visualization = Visualization.query.get(id)

    if visualization.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'})
    

    return jsonify(visualization.to_dict())

    
