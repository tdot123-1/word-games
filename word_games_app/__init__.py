from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from decouple import config
import nltk
import os
import zipfile

# define db, db_name
db = SQLAlchemy()
DB_NAME = "word-games.db"


# create app
def create_app():
    app = Flask(__name__)
    app.secret_key = config("FLASK_SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = config("DATABASE_URL", default=f"sqlite:///{DB_NAME}") 
    db.init_app(app)

    # define the path to the NLTK data directory
    nltk_data_path = os.path.join(os.path.dirname(__file__), 'nltk_data')

    # ensure NLTK data path includes the nltk_data directory
    nltk.data.path.insert(0, nltk_data_path)

    # check if wordnet already downloaded
    try:
        nltk.data.find('corpora/wordnet')
        print("WordNet already present")
    except LookupError:
        print("WordNet not found. Downloading")
        
        # create the directory if it does not exist
        if not os.path.exists(nltk_data_path):
            os.makedirs(nltk_data_path)

        # download the required NLTK data
        nltk.download('wordnet', download_dir=nltk_data_path)

        # check if the zip file exists and needs extraction
        wordnet_zip_path = os.path.join(nltk_data_path, 'corpora', 'wordnet.zip')
        if os.path.isfile(wordnet_zip_path):
            with zipfile.ZipFile(wordnet_zip_path, 'r') as zip_ref:
                zip_ref.extractall(os.path.join(nltk_data_path, 'corpora'))
            os.remove(wordnet_zip_path)  # remove the zip file after extraction

        print("NLTK data setup complete.")

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
