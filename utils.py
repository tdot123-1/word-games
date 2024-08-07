import os
import base64
from nltk.corpus import wordnet as wn
import random


# new word validation using nltk
def word_exists(word):
    if wn.synsets(word):
        return True
    
    return False


def key_generator():
    key_bytes = os.urandom(24)
    key = base64.urlsafe_b64encode(key_bytes).decode('utf-8')
    return key


# make sure pw has both letters and numbers
def check_letters_numbers(password):
    # for each char in pw, check if it is a letter (.isalpha)
    # if true (= 1), add up to letter_count (sum)
    letter_count = sum(char.isalpha() for char in password)
    number_count = sum(char.isdigit() for char in password)
    # return true if at least 1 letter and 1 number found
    return number_count > 0 and letter_count > 0


# several checks for username and pw
def validate_registration(password1, password2, username):
    errors = []

    if len(username) < 3:
        errors.append("Username must be at least 3 characters")
    elif len(username) > 10:
        errors.append("Username can be no more than 10 characters")
    elif ' ' in username:
        errors.append("Username cannot contain spaces")
    elif not username.isalnum():
        errors.append("Username cannot contain special characters or spaces")

    if len(password1) < 6:
        errors.append("Password must be at least 6 characters")
    elif password1 != password2:
        errors.append("Password confirmation failed")
    elif check_letters_numbers(password1) is False:
        errors.append("Password must contain both letters and numbers")
    elif ' ' in password1:
        errors.append("Password cannot contain spaces")
    elif not password1.isalnum():
        errors.append("Password cannot contain special characters")

    return errors


# ! currently not used
# for future update: select word on backend and somehow use on frontend without exposing it
def select_random_word():
    list_of_words = [
        "apple", "brush", "chair", "dance", "eagle", "fable", "grape", "house", "igloo", "joker",
        "knife", "lemon", "mango", "noble", "ocean", "piano", "queen", "rainy", "sugar", "table", 
        "uncle", "vivid", "whale", "young", "zebra", "alarm", "blink", "chess", "dough", "elbow", 
        "flame", "giant", "hatch", "ivory", "jelly", "knots", "lunch", "marsh", "novel", "oasis", 
        "pilot", "quiet", "ruler", "skate", "thorn", "ultra", "winds", "yield", "zesty", "agile", 
        "baker", "cliff", "drift", "eager", "flock", "glory", "happy", "index", "jolly", "kiosk", 
        "lunar", "magic", "navel", "otter", "peach", "quest", "river", "sweep", "tiger", "under", 
        "vibes", "waltz","phone", "yacht", "adapt", "beast", "cloud", "dwarf", "erase", "frisk", 
        "gravy","honor", "image", "jumps", "knock", "lunar", "medal", "nurse", "olive", "peace", 
        "quick", "round", "salty", "toast", "unity", "vault", "wrist", "house", "young", "birds",
    ]

    random_word = random.choice(list_of_words)
    print(f"selected word: {random_word}")
    return random_word