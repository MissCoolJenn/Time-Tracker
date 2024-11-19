import eel

# Инициализация папки web
eel.init('Client\web')

# Запуск HTML-файла
eel.start('Main.html', size=(300, 300), port=8008)