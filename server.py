from waitress import serve
from main import app
from decouple import config

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=config("PORT"))