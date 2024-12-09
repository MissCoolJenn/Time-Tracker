// Проверка активно ли окно браузера сейчас
async function is_active_browser() {
    const window = await new Promise((resolve) => {
        chrome.windows.getCurrent({ populate: false }, resolve)
    });
    return window.focused;
}

// Получение информации о пользователе
async function get_user_info() {
    return new Promise((resolve) => {
        chrome.identity.getProfileUserInfo((userInfo) => {
            if (userInfo) {
                let date_now = Date.now();

                //console.log(\nDate: ${date_now});
                //console.log("Email:", userInfo.email); // Email пользователя
                //console.log("ID:", userInfo.id); // ID пользователя
                
                log_active_tab_url().then((active_url) => {
                    resolve([userInfo.email, active_url, date_now]);
                });
            } 
            else {
                resolve([null, null, Date.now()]);
            }
        });
    });
}

// Проверка какая сейчас вкладка открыта в гугле
async function log_active_tab_url() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            let activeTab = tabs[0];

            if (activeTab) {
                let clear_url = re_url(activeTab.url);  //.then(console.log)
                resolve(clear_url); // Возвращаем URL активной вкладки
            } 
            else {
                resolve('NaN'); // Возвращаем NaN, если вкладок нет
            }
        })
    })
}

// Нахождение url и очистка его от лишних символов
async function re_url(url) {
    return new Promise((resolve) => {
        // Если url начинается с 'https://' 
        const match = url.match(/^https?:\/\/[^\/]+\/?/);

        if (match !== null) {
            let match_s = match[0].replace(/^.+\/\//, '');     // Убирается начало htpps://
            let match_e = match_s.replace(/\/$/, '');          // Убирается все что после .com
            let match_f = match_e.replace(/^www./, '');        // Убирается www. что иногда присутствуют в начале

            //console.log(`Активная вкладка сейчас: ${match_f}`)
            resolve(match_f);                                  // Возвращаем чистый url
        } 
        else {
            //sconsole.log("Некорректный URL");
        }
    });
}

// Получение времени на сейчас
async function get_date_now() {
    return new Promise((resolve) => {
        const today = new Date();
        const timestamp = Date.now();

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        const milliseconds = today.getMilliseconds();

        const date = [timestamp, year, month, day, hours, minutes, seconds, milliseconds];
        resolve(date);
    });
}

// Класс для выполнения задач по обращению в БД и сохранению данных
class Save_url {
    async main(url, delta_s, date) {
        let key = `${date[1]} ${date[2]} ${date[3]}`;
        //console.log(`key: ${key}`);

        // Получение словаря url за сегодня
        let urls_today = await this.get_storage(key);
        //console.log(`url_today_exist: ${JSON.stringify(urls_today)}`)

        // ПРИМЕР ДАТЫ:
        // "2024 10 21" = { url: 6404, url: 577 }
        //                          ^ значение - Сколько сек была активна вкладка
        //                    ^ ключ - Cслылка
        //   ^ ключ - День

        // Обновление активного времени url в БД за сегодня
        if (urls_today.hasOwnProperty(url)) {
            urls_today[url] = urls_today[url] + delta_s;
        }
        // Добавление url в БД за сегодня
        else {
            //console.log('**Добавление url в БД за сегодня')
            urls_today[url] = delta_s
        }

        //console.log(`urls_today после просчета времени: ${JSON.stringify(urls_today)}`);

        // Сохранение словаря url за сегодня обратно в БД
        let save_db = await this.set_storage(key, urls_today);
        if (save_db) {
            //console.log(`data saved is: ${save_db}`);
        }
    };

    async get_storage(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key] || {});
            })
        })
    };

    async set_storage(key, value) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, (result) => {
                resolve(true);
            })
        })
    };
};

// Солнце светит, негры пашут
async function loop(loop_time) {
    let chrome_active = await is_active_browser();

    //console.log('\n\n')

    if (chrome_active) {
        // Получение данных о url активной вкладки
        let user = await get_user_info();

        // Получение времени сейчас 
        let date_now = await get_date_now();

        // Сохранение в БД данных о url
        await new Save_url().main(user[1], loop_time/1000, date_now);
    } 
    else {
        //console.log("Окно неактивно... пока никто не видит z z z z ");
    }
}

//let loop_time = 2000;
//// Начало кода и запуск рабского цикла
//console.log('Hi)');
//
//// Восстановление задач после выхода из сна
//chrome.runtime.onStartup.addListener(() => {
//    console.log("Хром запущен, восстановление потужностi...");
//    setInterval(() => loop(loop_time), loop_time);
//});
//
//// Восстановление при повторном запуске расширения
//chrome.runtime.onInstalled.addListener(() => {
//    console.log("Обновление установлено, запуск потужностi...");
//    setInterval(() => loop(loop_time), loop_time);
//});
//
//// Перезапуск setInterval при выходе из сна
//chrome.runtime.onSuspendCanceled.addListener(() => {
//    console.log("Компьютер проснулся. Перезапуск цикла...");
//    setInterval(() => loop(loop_time), loop_time);
//});

const loop_time = 2000;                             // Интервал в миллисекундах
const loopTimeMinutes = loop_time / 1000 / 60;      // Интервал в минутах

// Создаем будильник
function createAlarm() {
    chrome.alarms.create("loopAlarm", { periodInMinutes: loopTimeMinutes });
    console.log("Будильник создан с интервалом", loopTimeMinutes * 60, "секунд.");
}

// Обработка срабатывания будильника
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "loopAlarm") {
        loop(loop_time);
    }
});

// Восстановление задач после запуска браузера
chrome.runtime.onStartup.addListener(() => {
    console.log("Хром запущен, восстановление задач...");
    createAlarm();
});

// Восстановление задач при установке/обновлении расширения
chrome.runtime.onInstalled.addListener(() => {
    console.log("Расширение установлено или обновлено. Запуск задач...");
    createAlarm();
});

// Перезапуск будильника при выходе из сна
chrome.runtime.onSuspendCanceled.addListener(() => {
    console.log("Компьютер проснулся. Перезапуск будильника...");
    createAlarm();
});

// Начало выполнения кода
//console.log("Расширение запущено.");
//createAlarm();