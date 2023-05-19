from .db import db, environment, SCHEMA, add_prefix_for_prod


class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    visualization_id = db.Column(db.Integer, db.ForeignKey('visualizations.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='favorites')
    visualization = db.relationship('Visualization', back_populates='favorites')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'visualization_id': self.visualization_id,
            'created_at': self.created_at,
        }
