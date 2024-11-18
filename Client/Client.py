import requests

# Данные для отправки
data = {
    'name': 'Jenn',
    'password': 'xd1234'
}

# Отправляем POST-запрос на сервер
response = requests.post('http://localhost:5000/login', json=data)

# Проверяем ответ
if response.status_code == 200:
    print(response.json())  # Выводим ответ сервера
else:
    print(f'Ошибка: {response.status_code} - {response.json()["message"]}')