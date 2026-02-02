import sqlite3
from config import DB_PATH, ROOT
from flask import g, current_app

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH)
    return db 

def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    path = ROOT / "db/db_sql.sql"
    with current_app.open_resource(path.absolute().as_posix()) as f:
        db.executescript(f.read().decode("utf-8"))
    db.commit()

def query_db(query, args=(), one=False):
    db = get_db()
    cur = db.execute(query, args)
    if query.lstrip().upper().startswith("SELECT"):
        rv = cur.fetchall()
    else:
        rv = None
        db.commit()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def init_app(app):
    app.teardown_appcontext(close_connection)