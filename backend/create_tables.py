import sqlite3

conn = sqlite3.connect("medipredict.db")
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
);
""")

conn.commit()
conn.close()

print("Database & users table created successfully!")
