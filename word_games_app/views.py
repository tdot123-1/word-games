# PyDictionary
# views
from flask import Blueprint, render_template, url_for, request
from flask_login import login_required, current_user
from .models import User, Scores
from . import db

# specify blueprint for views routes
views = Blueprint("views", __name__)

@views.route("/")
def index():
    return render_template("word-games/index.html", user=current_user)


