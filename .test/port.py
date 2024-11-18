from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def get_data():
    data = request.json
    response = {"message": "Response from Python", "received": data}
    return jsonify(response)

if __name__ == '__main__':
    # Запуск сервера без автоматической перезагрузки
    app.run(port=5000, host='0.0.0.0', use_reloader=False)
