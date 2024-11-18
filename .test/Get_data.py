import win32process, win32gui, datetime, psutil, ctypes, time, re
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
        'process_name': process_name,
        'pid': pid.value
    }
# 2024-10-29 14:04:36.563353
# pid: 18512
# active: 1048758
# active_window: 7272
# 
# Заголовок окна: main.py - Time Tracker - Visual Studio Code
# Имя процесса: Code.exe

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
            #if match:
            #    return {
            #        'tab_title': match.group(1),
            #        'url': None  # Chrome не предоставляет прямой доступ к URL через Win32 API
            #    }
            if match:
                # Здесь мы получаем информацию о текущей вкладке через CDP
                # Это пример, который может потребовать доработки
                session_id = get_chrome_session_id(pid)
                if session_id:
                    url = get_active_tab_url(session_id)
                    account_info = extract_account_info(url)
                    return {
                        'tab_title': match.group(1),
                        'url': url,
                        'account_info': account_info
                    }
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass
    return None
# 2024-10-31 17:47:05.869611
# pid: 2624
# active: 132540
# active_window: 1044
# 
# Активная вкладка Chrome: DeepL Translate – Самый точный переводчик в мире

def Begin():
    pid = wintypes.DWORD()
    active = ctypes.windll.user32.GetForegroundWindow()
    active_window = ctypes.windll.user32.GetWindowThreadProcessId(active, ctypes.byref(pid))
    pid = pid.value

    while True:
        print('\n\n')
        date_now = datetime.datetime.now()
        print(date_now)
        #print(f'pid: {pid} \nactive: {active} \nactive_window: {active_window}\n')
        tab_info = get_chrome_active_tab_title()
        if tab_info:
            print(f"Активная вкладка Chrome: {tab_info['tab_title']}")
        else:
            window_info = get_active_window_title()
            #print(f"Заголовок окна: {window_info['window_title']}")
            print(f"Имя процесса: {window_info['process_name']}")
        time.sleep(1)




