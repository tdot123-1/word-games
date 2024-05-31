from . import db
from flask_login import UserMixin

# table for user data
class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    

# table for high scores, foreign key relationship with Users table
class Scores(db.Model):
    __tablename__ = "high_scores"
    id = db.Column(db.Integer, primary_key=True)    
    total_points = db.Column(db.Integer, default=0)
    hs_search = db.Column(db.Integer, default=0)
    hs_guess = db.Column(db.Integer, default=0)
    hs_rush = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", backref=db.backref("high_scores", lazy=True))
