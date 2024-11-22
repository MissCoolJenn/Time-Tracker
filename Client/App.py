import sqlite3
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
            print('new ok')
            return 'new ok'
        else:
            print('ok')
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
        return 'adfdgzdg'

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
