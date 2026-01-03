import sqlite3

def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        age INTEGER,
        gender TEXT,
        reset_token TEXT,
        first_login INTEGER DEFAULT 1
    )
    """)

    conn.commit()
    conn.close()

# Create tables when backend starts
create_tables()
