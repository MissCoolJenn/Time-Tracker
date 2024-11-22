import eel

# Инициализация папки web
eel.init('Client/web')

# Запускаем Eel
eel.start(
    'Main.html',
    size=(800, 600),  # Указываем размер окна
)