async function get_date_now() {
    return new Promise((resolve) => {
        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const date = `${year} ${month} ${day}`;
        resolve(date);
    })
}

async function get_data(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key] || {});
        })
    })
};

async function recount_time(data) {
    return new Promise((resolve) => {
        // {"accounts.google.com":4,"epicgames.com":8,"github.com":48,"google.com":16,"nexusmods.com":102,"youtube.com":486}
        let new_data = [];
        let keys = Object.keys(data)
        
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
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

            time_str = (hour >0 ? hour + 'h ' : '' ) + (min >0 ? min + 'm ' : '') + sec + 's';

            new_data.push(`${key}: ${time_str}`);
        }

        resolve(new_data);
    })
}

async function page_elements(data_list) {
    return new Promise((resolve) => {
        let main = document.getElementById('main');

        for (let i = 0; i < data_list.length; i++) {
            let el_div = document.createElement('div');

            let el_p = document.createElement('p');
            el_p.textContent = data_list[i];
            el_div.appendChild(el_p);

            if (i != (data_list.length -1)) {
                let el_hr = document.createElement('hr');
                el_div.appendChild(el_hr);
            }

            main.appendChild(el_div);
        }
        resolve();
    })
}

async function biden() {
    // Получение даты
    let date = await get_date_now();

    console.log(date);

    // Запрос данных из БД
    let data = await get_data(date);

    // Пересчет секунд на ч\м\с
    let data_a = data //JSON.stringify(data);
    let data_list = await recount_time(data_a);

    console.log(data_list);
    
    // Вывод данных на страницу
    await page_elements(data_list);
}

// Срабатывает при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    biden();
});