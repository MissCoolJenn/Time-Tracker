import threading, time
import Settings, Check_data, Get_data

def data_collect():
    
    Get_data.Begin()

def open_app():
    while True:
        print('pass')
        time.sleep(3)

if __name__ == '__main__':
    # Проверка и установка настроек
    #Settings.settings_init()

    # Проверка файлов данных (если нет - напомнить установить расширение)
    #Check_data.check_init()

    # Создание отдельных потоков
    thread_data = threading.Thread(target=data_collect)
    thread_app = threading.Thread(target=open_app)

    # Запускаем потоки
    thread_data.start()
    thread_app.start()

    # Ожидаем завершения потоков
    thread_data.join()
    thread_app.join()

    print("Все потоки завершены!")