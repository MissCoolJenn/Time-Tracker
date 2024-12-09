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
        //let keys = Object.keys(data)

        // Сортировка по времени от большего к меньшему (возват - список)
        const sortedObj = Object.fromEntries(
            Object.entries(data).sort(([, a], [, b]) => b - a)
        );
        //console.log(`sortedObj: ${JSON.stringify(sortedObj)}`);

        let keys = Object.keys(sortedObj)
        

        let final_data = [];
        // Перевод значений в более удобный формат для вывода на странице
        for (let i = 0; i < keys.length; i++) {
            //console.log(sortedDictionary[i])
            //return;
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

            time_str = [(hour >0 ? hour + 'h ' : '' ) + (min >0 ? min + 'm ' : '') + sec + 's'];

            final_data.push([`${key}: ${time_str}`, (hour >0 ? 'z' : '' ) + (min >0 ? 'v' : '') + 'o']);
        }

        resolve(final_data);
    })
}

// Вывод данных на страницу
async function page_elements(data_list) {
    return new Promise((resolve) => {
        const main = document.getElementById('main');
        
        const item_count = data_list.length;
        let p_id_list = [];
        let hr_id_list = [];

        for (let i = 0; i < item_count; i++) {
            
            let el_div = document.createElement('div');     // создать div

            const el_p = document.createElement('p');       // создать p
            const el_p_id = `el_p-${i}`;                    // создать уник id для p
            el_p.setAttribute("id", el_p_id);               // добавить p уник id
            p_id_list.push(el_p_id);                        // добавить р в список объектов
            el_p.style.opacity = 0;                         // добавить p стиль прозрачность 0
            el_p.textContent = data_list[i][0];             // добавить в p текст
            el_div.appendChild(el_p);                       // добавить p в div
        
            if (i != (item_count -1)) {
                const el_hr = document.createElement('hr'); // создать hr
                const el_hr_id = `el_hr-${i}`;              // создать уник id для hr
                el_hr.setAttribute("id", el_hr_id);         // добавить hr уник id
                hr_id_list.push(el_hr_id)                   // добавить hr в список объектов
                el_hr.style.opacity = 0;                    // добавить hr стиль прозрачность 0
                el_div.appendChild(el_hr);                  // добавить hr в div
            }

            main.appendChild(el_div);

            // добавляет анимацию по очереди 
            (async function animateElements() {
                for (let i = 0; i < item_count; i++) {
                    // анимация р
                    const el_p = document.getElementById(p_id_list[i]);
                    el_p.style.opacity = 1;
                    el_p.classList.add('slide_in_right');
                
                    // анимация hr если он существует
                    if (i != item_count - 1) {
                        setTimeout(function() {   
                            const el_hr = document.getElementById(hr_id_list[i]);
                            el_hr.style.opacity = 1;
                            el_hr.classList.add('slide_in_right');
                        }, 50);
                    }

                    // анимация тени для текста
                    const timeout = 500;
                    if (data_list[i][1] == 'svo') {
                        setTimeout(function() {
                            el_p.classList.add('shadow_animation_pink');
                        }, timeout)
                    }
                    else if (data_list[i][1] == 'vo') {
                        setTimeout(function() {
                            el_p.classList.add('shadow_animation_blue');
                        }, timeout)
                    }
                    else if (data_list[i][1] == 'o') {
                        setTimeout(function() {
                            el_p.classList.add('shadow_animation_grey');
                        }, timeout)
                    }
                
                    await new Promise((r) => setTimeout(r, 100));
                };
            })();
        }



        // через setinterval(100) добавлять класс анимации css по очереди сначала p потом hr
        // ^ так же р и hr нужно менять цвет с белого на черный 
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