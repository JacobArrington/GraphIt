from .db import db, environment, SCHEMA, add_prefix_for_prod

class Visualization(db.Model):
    __tablename__ = 'visualizations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    data_file_id = db.Column(db.Integer, db.ForeignKey('data_files.id'))
    #manual_data = db.Column(db.String(1000))
    visualization_type = db.Column(db.String(64), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(500))
    views = db.Column(db.Integer, default=0)
    visibility = db.Column(db.String(64), nullable=False)
    color = db.Column(db.String(64))
    size = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, onupdate=db.func.current_timestamp())


    user = db.relationship('User', back_populates='visualizations')
    data_file = db.relationship('DataFile', back_populates='visualizations')
    comments = db.relationship('Comment', back_populates='visualization')
    favorites = db.relationship('Favorite', back_populates='visualization')




    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'data_file_id': self.data_file_id,
            'manual_data': self.manual_data,
            'visualization_type': self.visualization_type,
            'title': self.title,
            'description': self.description,
            'views': self.views,
            'visibility': self.visibility,
            'color': self.color,
            'size': self.size,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
    }
