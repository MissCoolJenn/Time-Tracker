function send_data() {
    const data = {
        'name': 'Jenn',
        'password': 'xd1234'
    };

    fetch('http://localhost:5000/login', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json().then(data => ({ status: response.status, ok: response.ok, body: data }));
    })
    .then(({ status, ok, body }) => {
        if (ok) {
            console.log('Ответ сервера:', body);
        } else {
            console.error(`Ошибка: ${status} - ${body.message}`);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

document.getElementById('otsos').addEventListener('click', send_data);