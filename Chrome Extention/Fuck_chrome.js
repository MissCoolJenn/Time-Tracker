// Получение информации о пользователе
function get_user_info() {
    return new Promise((resolve) => {
        chrome.identity.getProfileUserInfo((userInfo) => {
            if (userInfo) {
                var date_now = Date.now();
                //console.log(`\nDate: ${date_now}`);
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
function log_active_tab_url() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            const activeTab = tabs[0];

            if (activeTab) {
                re_url(activeTab.url)//.then(console.log)
                resolve(activeTab.url); // Возвращаем URL активной вкладки
            } 
            else {
                resolve('NaN'); // Возвращаем NaN, если вкладок нет
            }
        });
    });
}


// Нахождение url и очистка его от лишних символов
function re_url(url) {
    return new Promise((resolve, reject) => {
        // Если url начинается с 'https://' 
        const match = url.match(/^https?:\/\/[^\/]+\/?/);

        // https://www.youtube.com/watch?v=pfiCN...
        // Https://claude.ai/chat/a3f74ee5...
        // chrome://newtab/
        // chrome://history/

        if (match !== null) {
            let match_s = match[0].replace(/^.+\/\//, '');   // Убирается начало htpps://
            let match_e = match_s.replace(/\/$/, '');        // Убирается все что после .com
            let match_f = match_e.replace(/^www./, '');      // Убирается www. что иногда присутствуют в начале

            // www.youtube.com - дочистить в некоторых ссылках

            console.log(`Активная вкладка сейчас: ${match_f}`)
            resolve(match_f); // Возвращаем чистый url
        } 
        else {
            //resolve("Некорректный URL"); // Или resolve(null) для мягкой обработки
            console.log("Некорректный URL");
        }
    });
}


class Data {
    constructor() {
        return;
        // ПРИМЕР ДАТЫ:
        // {url}: [[2024:10:21, 640], [2024:10:22, 577]]
        //                      ^ Сколько мин была активна вкладка
        //              ^ День 
        //   ^ сслылка
    };

    save(url, time) {
        // Если Url ещё раньше не сохранялся в БД
        if (chrome.storage.local.get(['url']) == undefined) {
            
        }
        else {

        }
    };

    rewhrite(url, delta_time) {
        return;
    };

    get_today() {
        return;
    };

    get_all() {
        return;
    };

    delete(date) {
        return;
    };
};;


// Солнце светит, негры пашут
// Цикл с асинхронной обработкой
async function loop() {
    // Используем промисифицированную обёртку для `chrome.windows.getCurrent`.
    const window = await new Promise((resolve) => {
        chrome.windows.getCurrent({ populate: false }, resolve);
    });
    
    // Окно активно 
    if (window.focused) {
        // Асинхронный вызов моего говна
        //const q = await get_user_info(); // Ждём получения информации
        //if (q[1] == 'NaN') {  // Проверка на NaN
        //    console.log("Нет активной вкладки, пошел нахуй");
        //} 
        //else {
        //    console.log("Данные пользователя и вкладки:", q);
        //}

        await get_user_info();
    } 
    // Окно не активно 
    else {
        console.log("Окно неактивно... пока никто не видит z z z z ");
    }
}

// Начало кода и запуск рабского цикла
console.log('Hi)');

setInterval(loop, 1000);

// Восстановление задач после выхода из сна
chrome.runtime.onStartup.addListener(() => {
    console.log("Chrome started, restarting tasks...");
    setInterval(loop, 1000);
});
  
// Восстановление при повторном запуске расширения
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed/updated, starting tasks...");
    setInterval(loop, 1000);
});