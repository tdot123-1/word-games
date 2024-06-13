from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from decouple import config

# define db, db_name
db = SQLAlchemy()
DB_NAME = "word-games.db"


# create app
def create_app():
    app = Flask(__name__)
    app.secret_key = config("FLASK_SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")

    from .models import User, Scores

    with app.app_context():
        db.create_all()
    
    login_manager = LoginManager()
    login_manager.login_view = "views.index"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app
