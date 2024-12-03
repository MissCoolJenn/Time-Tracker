function get_date_now() {
    return new Promise((resolve) => {
        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const date = `${year} ${month} ${day}`;
        resolve(date);
    })
}

function get_data(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key] || {});
        })
    })
};

function recount_time(data) {
    return new Promise((resolve) => {
        // {"accounts.google.com":4,"epicgames.com":8,"github.com":48,"google.com":16,"nexusmods.com":102,"youtube.com":486}
        let new_data = [];
        
        for (let i = 0; i > Range(data); i++) {
            let key = data[i];
            let sec = data[key];
            let min = 0;
            let hour = 0;

            //  Пересчет минут
            if (sec >= 60) {
                while (sec >= 60) {
                    sec -= 60;
                    min++;
                }
            }

            //  Пересчет часов
            if (min >= 60) {
                while (min >= 60) {
                    min -= 60;
                    hour++;
                }
            }

            time_str = (hour >0 ? hour + 'h' : '') + (min >0 ? min + 'm' : '') + sec + 's';

            new_data.push(`${key}: ${time_str}`);
        }

        resolve(new_data);
    })
}


function biden() {
    // Получение даты
    let date = get_date_now();

    console.log(date);

    // Запрос данных из БД
    let data = get_data(date);

    // Пересчет секунд на ч\м\с
    let data_a = JSON.stringify(data);
    let data_list = recount_time(data_a);

    console.log(data_list);
    
    // Вывод данных на страницу
}

// Срабатывает при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    console.log('Hi page)')
    biden();
});