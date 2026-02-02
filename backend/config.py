from flask import Flask
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
CORS(app)
ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "db/library.db"