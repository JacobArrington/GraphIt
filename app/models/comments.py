from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    visualization_id = db.Column(db.Integer, db.ForeignKey('visualizations.id'), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='comments')
    visualization = db.relationship('Visualization', back_populates='comments')


    def to_dict(self):
     return {
            'id': self.id,
            'user_id': self.user_id,
            'visualization_id': self.visualization_id,
            'content': self.content,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'update_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
    }
