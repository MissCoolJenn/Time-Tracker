from flask import Flask
from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
api = Api(app)

# Создаем класс для ресурса
class UserResource(Resource):
    def post(self):
        # Создаем парсер для входных данных
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('password', required=True)
        
        # Получаем данные из запроса
        args = parser.parse_args()
        
        # Проверяем, совпадают ли имя и пароль
        if args['name'] == 'Jenn' and args['password'] == 'xd1234':
            return {'message': 'Отсос успешен'}, 200
        else:
            return {'message': 'Инвалид'}, 401

# Регистрируем ресурс
api.add_resource(UserResource, '/login')

if __name__ == '__main__':
    app.run(debug=True)