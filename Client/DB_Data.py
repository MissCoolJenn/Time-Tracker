import os
import sqlite3

db_name = 'minet_history.db'

def connection():
    # Проверяем, существует ли файл базы данных
    if not os.path.exists(db_name):
        print("База данных не существует. Создаем новую...")
        conn = sqlite3.connect(db_name)  # Создаем новый файл базы данных
        cursor = conn.cursor()

        # Создаем таблицы
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            app TEXT NOT NULL
        )
        ''')
        conn.commit()
    else:
        conn = sqlite3.connect(db_name)

    cursor = conn.cursor()


# Добавляем данные для теста
#cursor.execute('INSERT INTO users (date, app) VALUES (?, ?)', ('2024, 11, 19, 11, 31, 35, 123000', 'Chrome'))
#cursor.execute('INSERT INTO users (date, app) VALUES (?, ?)', ('2024, 11, 19, 11, 31, 35, 123000', 'Code'))
# Сохраняем изменения
#conn.commit()


def save_z(date, app):
    connection()

    conn = sqlite3.connect('minet_history.db')
    cursor = conn.cursor()

    cursor.execute('INSERT INTO users (date, app) VALUES (?, ?)', (date.isoformat(), app))

    conn.commit()

    cursor.execute('SELECT * FROM users')
    rows = cursor.fetchall()
    for row in rows:
        print(row)

    conn.close()