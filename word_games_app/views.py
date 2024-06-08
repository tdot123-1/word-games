# PyDictionary
# views
from flask import Blueprint, render_template, url_for, request
from flask_login import login_required, current_user
from .models import User, Scores
from . import db

# specify blueprint for views routes
views = Blueprint("views", __name__)

# index page
@views.route("/")
def index():
    return render_template("word-games/index.html", user=current_user)

# word search
@views.route("/word-guess")
def word_guess():
    return render_template("word-games/word-guess.html", user=current_user)

# word rush

# word guess

# high scores


