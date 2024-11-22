import eel

# Инициализация папки web
eel.init('Client/web')

# Запускаем Eel
eel.start(
    'Main.html',
    size=(800, 600),  # Указываем размер окна
)

# pyinstaller --noconfirm --onefile --noconsole --add-data "web;web" --add-data "d:/Dev/axaxa/.venv/lib/site-packages/eel/eel.js;eel" App.py
