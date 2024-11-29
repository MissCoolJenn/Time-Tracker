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
                resolve(activeTab.url); // Возвращаем URL активной вкладки
            } 
            else {
                resolve('NaN'); // Возвращаем NaN, если вкладок нет
            }
        });
    });
}


// Солнце светит, негры пашут
// Цикл с асинхронной обработкой
async function loop() {
    const q = await get_user_info(); // Ждём получения информации

    if (q[1] == 'NaN') {  // Проверка на NaN
        console.log("Нет активной вкладки, пошел нахуй");
    } 
    else {
        console.log("Данные пользователя и вкладки:", q);

        // https://www.youtube.com/watch?v=pfiCN...
        // Https://claude.ai/chat/a3f74ee5...
        // chrome://newtab/
        // chrome://history/
    }
}
// Начало кода и запуск рабкого цикла
console.log('Hi)');



setInterval(loop, 2000);