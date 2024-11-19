import datetime, psutil, ctypes, time
from ctypes import wintypes

def get_active_window_title():
    # Получаем handle активного окна
    hwnd = ctypes.windll.user32.GetForegroundWindow()
    # Получаем PID процесса
    pid = wintypes.DWORD()
    ctypes.windll.user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
    # Получаем длину заголовка окна
    length = ctypes.windll.user32.GetWindowTextLengthW(hwnd)
    buffer = ctypes.create_unicode_buffer(length + 1)
    # Получаем заголовок окна
    ctypes.windll.user32.GetWindowTextW(hwnd, buffer, length + 1)
    # Получаем имя процесса по PID
    try:
        process = psutil.Process(pid.value)
        process_name = process.name()
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        process_name = "Unknown"
    return {
        'window_title': buffer.value,
        'process_name': process_name[:-4].capitalize(),
        'pid': pid.value
    }
# 2024-10-29 14:04:36.563353
# pid: 18512
# active: 1048758
# active_window: 7272
# 
# Заголовок окна: main.py - Time Tracker - Visual Studio Code
# Имя процесса: Code

def Begin():
    pid = wintypes.DWORD()
    active = ctypes.windll.user32.GetForegroundWindow()
    active_window = ctypes.windll.user32.GetWindowThreadProcessId(active, ctypes.byref(pid))
    pid = pid.value

    while True:
        min_history = []

        for i in range(60):
            print('\n\n')

            begin_date = datetime.datetime.now()
            print(begin_date)

            # Получить имя активного окна
            window_info = get_active_window_title()
            #print(f"Заголовок окна: {window_info['window_title']}")
            print(f"Имя процесса: {window_info['process_name']}")

            # Сохранить в историю на уровень выше
            history  = [begin_date, window_info['process_name']]
            min_history.append(history)

            

            import DB_Data
            DB_Data.save_z(begin_date, window_info['process_name'])



            # Посчитать время выполнения кода
            end_date = datetime.datetime.now()
            print(f'время выполнения: {end_date-begin_date}')

            # Время ожидания между запросами
            time.sleep(4)

        print(min_history)

Begin()