from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Favorite, db

favorite_routes = Blueprint('favorites',__name__)

@favorite_routes.route('', methods=['GET'])
@login_required
def get_favorites():
    user_id = current_user.id
    user_favs = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([fav.to_dict() for fav in user_favs])


@favorite_routes.route('<int:vis_id>', methods=['POST'])
@login_required
def add_to_favorites(vis_id):
    user_id = current_user.id
    existing_fav = Favorite.query.filter_by(user_id=user_id, visualization_id=vis_id).first()
    if existing_fav:
        return{"error": "this graph is already in your favorites "}, 

    new_favorite =Favorite(
        user_id = current_user.id,
        visualization_id  = vis_id,
    )

    db.session.add(new_favorite)
    db.session.commit()
    return new_favorite.to_dict()

@favorite_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_favorite(id):
    fav = Favorite.query.get(id)
    if not fav:
        return{"error": "graph not found"}
    
    if current_user.id != fav.user_id:
        return {"error": "Unauthorized"}
    
    db.session.delete(fav)
    db.session.commit()
    return{"message": "Favorite deleted successfully"}



    
