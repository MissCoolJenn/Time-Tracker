from pywinauto import Desktop, Application
import time

time.sleep(4)
def url_grabber():
    try:
        # Находим окно Google Chrome
        chrome = Desktop(backend="uia").windows(title_re=".* Google Chrome$")[0]
        
        # Проверяем, что это активное окно
        if chrome.is_active():
            url_line = chrome.descendants(title='Адресная строка и строка поиска')[0]
            url = 'https://' + url_line.get_value()
            print(url)
        else:
            print("Google Chrome не активен.")
    
    except IndexError:
        print("Окно Google Chrome не найдено.")
    except Exception as e:
        print(f"Произошла ошибка: {e}")


while True:
    url_grabber()
    time.sleep(2)
