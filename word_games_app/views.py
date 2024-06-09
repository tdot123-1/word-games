# PyDictionary
# views
from flask import Blueprint, render_template, url_for, request, jsonify
from flask_login import login_required, current_user
from .models import User, Scores
from . import db
from utils import word_exists

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
@views.route("/update-game-data", methods=["POST"])
def update_game_data():

    total_points = 5
    data = request.json
    if data is None:
        return jsonify({"message": "Invalid JSON",
                        "category": "danger"})
    
    points = data.get("points")
    game = data.get("game")

    try:
        total_points += int(points)
    except ValueError:
        return  jsonify({"message": "Error updating points",
                         "category": "warning"})
    
    return jsonify({"message": f"Stats for {game} updated succesfully",
                    "category": "success"})



@views.route("/check-word-validity", methods=["POST"])
def check_word_validity():

    data = request.json
    if data is None:
        return jsonify({"message": "Invalid JSON",
                        "category": "danger"})
    
    game = data.get("game")
    word = data.get("word")
    if game == "wordGuess":

        if len(word) != 5:
            return jsonify({"message": "Guess must be 5 letters long",
                            "category": "warning"})
        if word_exists(word):
            return jsonify({"message": f"{word} was a valid guess",
                            "category": "success"})
        else:
            return jsonify({"message": "Guess must be a valid English word",
                            "category": "warning"})
        
    return jsonify({"message": "test"})

