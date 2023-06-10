from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Comment, User, db

comment_routes = Blueprint('comments', __name__)

@comment_routes.route('<int:vis_id>', methods=['GET', 'POST'])
@login_required
def comments(vis_id):
     if request.method == 'GET':
        comments = Comment.query.filter(Comment.visualization_id == vis_id).all()
        return {"comments": [comment.to_dict() for comment in comments]}
     elif request.method == 'POST':
        data = request.get_json()

        new_comment = Comment(
            user_id = current_user.id,
            visualization_id = vis_id,
            content =data['content']
        )

        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict()
    

@comment_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_comment(id):
    data = request.get_json()

    comment = Comment.query.get(id)
    if not comment:
        return {'error': 'Comment not found'}, 404
    
    if current_user.id != comment.user_id:
        return {"error": "You do not have permission to update this comment"}, 403
    
    comment.content = data['content']

    db.session.commit()
    return comment.to_dict()

@comment_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_comment(id):
    comment = Comment.query.get(id)
    if not comment: 
        return {"error": "Comment not found"},404
    
    if current_user.id != comment.user_id:
        return {"error": "You do not have permission to delete this comment"}, 403
    
    db.session.delete(comment)
    db.session.commit()
    return{"message":"Comment deleted successfully"}
