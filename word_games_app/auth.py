from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import User, Scores
from utils import check_letters_numbers, validate_registration

# specify blueprint for routes
auth = Blueprint("auth", __name__)

# register 
@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")

        user = User.query.filter_by(username=username).first()
        errors = validate_registration(password1, password2, username)
        
        # check for errors
        if user:
            flash("Username already taken", category="error")
        elif errors: 
            for error in errors:
                flash(error, category="error")
        else:
            # create new user
            hashed_password = generate_password_hash(password1)
            new_user = User()
            new_user.username = username
            new_user.password = hashed_password

            db.session.add(new_user)
            db.session.commit()

            new_scores = Scores(user_id=new_user.id)
            db.session.add(new_scores)
            db.session.commit()

            login_user(new_user, remember=True)
            flash(f"Registration successful, welcome {username}!", category="success")
            return redirect(url_for("views.index"))
    return render_template("word-games/register.html", user=current_user)


# login
@auth.route("/login", methods=["GET", "POST"])
def login_view():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()
        if user:
            if user.password is not None:

                if check_password_hash(user.password, password):
                    flash(f"Login successful, welcome back {username}", category="success")
                    login_user(user, remember=True)
                    return redirect(url_for("views.index"))
                else:
                    flash("Incorrect password", category="error")
            else:
                # if something went wrong storing user password on registration
                flash('User password is missing', category="error")
                return redirect(url_for("auth.login"))  # redirect back to login page
        else:
            flash("Username not found", category="error")
    return render_template("word-games/login.html", user=current_user)


# logout route
# logout user, flash message, redirect to login page
@auth.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out, until next time", category="success")
    return redirect(url_for("views.index"))

