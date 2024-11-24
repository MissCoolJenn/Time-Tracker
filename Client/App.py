import sqlite3
import json
import eel
import os

db_name = 'minet_history.db'

#***************************************************************************************************************
# Класс для работы с БД
class Data():
    def __init__(self):
        pass

    # Функции которые можно будет вызывать из js 
    @eel.expose
    def Check_db():
        # Проверяем, существует ли файл базы данных
        if not os.path.exists(db_name):
            Data.Create_db()
            print('db is new ok')
            return 'new ok'
        else:
            print('db is ok')
            return 'ok'

    @eel.expose
    def Create_db():
        # Создаем новый файл базы данных
        conn = sqlite3.connect(db_name)  
        cursor = conn.cursor()

        # Создаем таблицы - история приложений, история вкладок
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS apps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            app TEXT NOT NULL,
            date TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            url TEXT NOT NULL,
            date TEXT NOT NULL
        )
        ''')
        conn.commit()

        #cursor = conn.cursor()
        conn.close()
        return

    @eel.expose
    def Get_data():
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        #cursor.execute('INSERT INTO apps (date, app) VALUES (?, ?)', ('Goida', '10101001'))
        #cursor.execute('INSERT INTO apps (date, app) VALUES (?, ?)', ('VS Cock', '277777/2/2/3/4'))
        #conn.commit()

        cursor.execute('SELECT * FROM apps')

        rows = cursor.fetchall() #[(1, '27.239.3982578', 'Telegram'), (2, '227.2.1', 'Google'), (3, '10101001', 'Goida')]
        print(rows)

        conn.close()

        # Сворачивание списка в json (потому что js не может читать python списки)
        return json.dumps([list(item) for item in rows])

    @eel.expose
    def Add_data():
        pass

# Объект класса через который можно будет обращатся к классу
data_keeper = Data()


#***************************************************************************************************************
# Подключение к серверу и получение от него данных



#***************************************************************************************************************
# 


#***************************************************************************************************************
# Запуск
def init():
    # Инициализация папки web
    eel.init('Client/web')

    # Запускаем Eel
    eel.start(
        'Begin.html',
        size=(800, 600),  # Указываем размер окна
    )

init()

# pyinstaller --noconfirm --onefile --noconsole --add-data "web;web" --add-data "d:/Dev/axaxa/.venv/lib/site-packages/eel/eel.js;eel" App.py
