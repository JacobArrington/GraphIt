from .db import db, environment, SCHEMA, add_prefix_for_prod

class DataFile(db.Model):
    __tablename__ = 'data_files'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='data_files')
    visualizations = db.relationship('Visualization', back_populates='data_file')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'file_type': self.file_type,
            'file_path': self.file_path,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
    }
