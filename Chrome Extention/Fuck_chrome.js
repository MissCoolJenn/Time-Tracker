// Получение информации о пользователе
function get_user_info() {
    chrome.identity.getProfileUserInfo((userInfo) => {
        if (userInfo) {
            var date_now = Date.now()

            console.log(`\nDate: ${date_now}`);
            console.log("Email:", userInfo.email); // Email пользователя
            console.log("ID:", userInfo.id); // ID пользователя

            var active_url = log_active_tab_url();
            return [userInfo.email, active_url, date_now];
        }
    });

    // Проверка какая сейчас вкладка открыта в гугле
    function log_active_tab_url() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                console.log(activeTab.url); // Выводим URL активной вкладки в консоль
                
                return activeTab;
            }
        });
    }
}

class Data {
    // Созднаие елемента класса с данными
    constructor(email, url, time) {
        this.email = email;
        this.url = url;
        this.time = time;
    }

    // Чтение файла даты
    read_data() {
        try {
            const js_data = fs.readFileSync('js_data.txt', 'utf8');
            return js_data;
        } 
        catch (err) {
            // файл не найден
            if (err.code === 'ENOENT') {
                create_data();
            } 
            // ошибка при чтении файла
            else {
                console.error('Ошибка при чтении файла:', err);
            }
        }
    }

    // Создание файла даты
    create_data() {
        fs.writeFileSync('js_data.txt');
        console.log('Файл создан!!!');
    }

    // Дозапись файла даты
    write_data(data) {
        fs.appendFileSync('js_data.txt', `\n${data}`);
        console.log('Файл дописан');
    }
}

function send_data() {
    // Данные для отправки
    const data = {
        'name': 'Jenn',
        'password': 'xd1234'
    };

    // Отправляем POST-запрос на сервер
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (response.ok) {
            console.log(data); // Выводим ответ сервера
        } else {
            console.error(`Ошибка: ${response.status} - ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}


// Проверка файла настроек для передачи комманд с питухона на жабаскрипт или наоборот
function pituhon_and_jaba_forever() {
}


// Солнце светит, негры пашут
function loop() {
    var class_element = new Data(get_user_info());
}

// Начало кода и запуск рабкого цикла
console.log('Hi)');



setInterval(loop, 2000);