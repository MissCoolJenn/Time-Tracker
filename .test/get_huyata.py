from ctypes import wintypes
import win32process
import win32gui
import datetime
import psutil
import ctypes
import time
import re

pid = wintypes.DWORD()
active = ctypes.windll.user32.GetForegroundWindow()
active_window = ctypes.windll.user32.GetWindowThreadProcessId(active, ctypes.byref(pid))
pid = pid.value

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
        'process_name': process_name,
        'pid': pid.value
    }

def get_chrome_active_tab_title():
    # Получаем активное окно
    window = win32gui.GetForegroundWindow()
    # Получаем текст заголовка окна
    title = win32gui.GetWindowText(window)
    
    # Получаем PID процесса
    _, pid = win32process.GetWindowThreadProcessId(window)
    
    try:
        # Получаем процесс по PID
        process = psutil.Process(pid)
        
        # Проверяем, что это Chrome
        if process.name() == "chrome.exe":
            # Заголовок окна Chrome имеет формат "Название вкладки - Google Chrome"
            # Используем регулярное выражение для извлечения названия вкладки
            match = re.match(r"(.*) - Google Chrome", title)
            if match:
                return {
                    'tab_title': match.group(1),
                    'url': None  # Chrome не предоставляет прямой доступ к URL через Win32 API
                }
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass
        
    return None

# Пример использования
if __name__ == "__main__":
    while True:
        print('\n\n\n\n\n')
        date_now = datetime.datetime.now()
        print(date_now)
        print(f'pid: {pid} \nactive: {active} \nactive_window: {active_window}\n')

        tab_info = get_chrome_active_tab_title()
        if tab_info:
            print(f"Активная вкладка Chrome: {tab_info['tab_title']}")
        else:
            window_info = get_active_window_title()
            print(f"Заголовок окна: {window_info['window_title']}")
            print(f"Имя процесса: {window_info['process_name']}")

        time.sleep(1)

# 2024-10-29 14:04:36.563353
# pid: 18512
# active: 1048758
# active_window: 7272
# 
# Заголовок окна: main.py - Time Tracker - Visual Studio Code
# Имя процесса: Code.exe