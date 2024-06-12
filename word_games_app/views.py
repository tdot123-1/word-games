# PyDictionary
# views
from flask import Blueprint, render_template, url_for, request, jsonify
from flask_login import login_required, current_user
from .models import User, Scores
from sqlalchemy import desc
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


@views.route("/word-rush")
def word_rush():
    return render_template("word-games/word-rush.html", user=current_user)



@views.route("/high-scores")
def high_scores():
    # get arg if user clicked a column to sort
    column = request.args.get("column")
    # keep dict of valid columns, in case user tried to manually type a column
    valid_columns = {
        "total_points": Scores.total_points,
        "hs_search": Scores.hs_search,
        "hs_guess": Scores.hs_guess,
        "hs_rush": Scores.hs_rush,
    }
    
    # try to get the selected column if it is valid, else sort by total points
    sort_column = valid_columns.get(column, Scores.total_points)

    # query scores sorted by column
    scores = db.session.query(
        User.username,
        Scores.total_points,
        Scores.hs_search,
        Scores.hs_guess,
        Scores.hs_rush,
    ).join(Scores, User.id == Scores.user_id).order_by(desc(sort_column)).all()

    # if a column was selected, return sorted data in json
    if column is not None:
        sorted_data = [{
            "username": row.username,
            "total_points": row.total_points,
            "hs_search": row.hs_search,
            "hs_guess": row.hs_guess,
            "hs_rush": row.hs_rush,
        } for row in scores]
        return jsonify(sorted_data)

    return render_template("word-games/high-scores.html", user=current_user, scores=scores)


# update high scores
@views.route("/update-game-data", methods=["POST"])
def update_game_data():

    data = request.json
    if data is None:
        return jsonify({"message": "Invalid JSON",
                        "category": "danger"})
    
    points = data.get("points")
    game = data.get("game")
    user_id = data.get("userId")

    try:
        points = int(points)
    except ValueError:
        return jsonify({"message": "error recasting points datatype",
                        "category": "danger"})

    score_entry = Scores.query.filter_by(user_id=user_id).first()

    if not score_entry:
        return jsonify({"message": "error retrieving user",
                        "category": "danger"})
    
    score_entry.total_points += points

    if game == "wordGuess":
        if points > score_entry.hs_guess: 
            score_entry.hs_guess = points
    elif game == "wordRush":
        if points > score_entry.hs_rush:
            score_entry.hs_rush = points
    
    db.session.commit()
    
    
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
    elif game == "wordRush":
        if len(word) != 5:
            return jsonify({"message": "Word must be 5 letters long",
                            "category": "warning"})
        if word_exists(word):
            return jsonify({"message": f"{word} was a valid word",
                            "category": "success"})
        else:
            return jsonify({"message": "Word must be a valid English word",
                            "category": "warning"})
        
    return jsonify({"message": "test", "category": "danger"})

