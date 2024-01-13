const domain = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
const key = 'a3f66b8e-3ca6-481a-8bc8-1052f9a12a1e';

const currentPage = 1;
const pageSize = 10;

function pluralize(n, content) {
    let result = content[2];
    n = Math.abs(n) % 100;
    let nt = n % 10;
    if (n >= 10 && n <= 20) result = content[2];
    else if (nt > 1 && nt < 5) result = content[0];
    else if (nt == 1) result = content[1];

    return `${n} ${result}`;
}

function showModal(guideId, guideName, guidePricePerHour, routeId, routeName, modal) {
    console.log(guideId, guideName, guidePricePerHour, routeId, routeName, modal);
    const orderCnt = document.getElementById('order-body');
    const orderBtn = document.getElementById('order-send');

    orderCnt.innerHTML = '';

    let form = new FormData();
    form.set('guide_id', guideId);
    form.set('route_id', routeId);
    form.set('date', NaN);
    form.set('duration', 1);
    form.set('persons', 1);
    form.set('basePrice', guidePricePerHour);

    let raw = `
        <div class="row">ФИО гида: ${guideName}</div>
        <div class="row">Название маршрута: ${routeName}</div>
        <div class="row">
            <div>Дата:<div>
            <input type="date" class="form-control" data-name="date">
        </div>
        <div class="row">
            <div>Время:<div>
            <input type="time"class="form-control" data-name="time">
        </div>
        <div class="row">
            <div>Длительность:<div>
            <select class="form-control" data-name="duration">
                <option value="1" selected>1 Час</option>
                <option value="2">2 Часа</option>
                <option value="3">3 Часа</option>
            </select>
        </div>
        <div class="row">
            <div>Число человек:<div>
            <input type="number" value="1" class="form-control" min="1" max="20" data-name="persons">
        </div>
        <div class="row">
            <div>Дополнительные опции:<div>
            <div>
                <input type="checkbox" id="discountOption" class="form-check-input" data-name="optionFirst">
                <label for="discountOption" class="form-check-label">Использовать скидку для пенсионеров</label>
                <p class="form-text">Стоимость уменьшается на 25%</p>
            </div>
            <div>
                <input type="checkbox" id="transferOption" class="form-check-input" data-name="optionSecond">
                <label for="transferOption" class="form-check-label">Трансфер до ближайших станций метро после экскурсии</label>
                <p class="form-text">Увеличивает стоимость в выходные на 25%, в будние на 30%</p>
            </div>
        </div>
        
        <div class="row">
            <div>Cтоимость: <span id="order-price">NaN<span><div>
        </div>

        <div class="row">
            <button class="btn btn-primary" id="order-send">Отправить</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
        </div>
    `;

    orderCnt.insertAdjacentHTML("beforeend", raw);

    const discountOption = document.getElementById('discountOption');
    const transferOption = document.getElementById('transferOption');

    discountOption.onchange = () => {
        calculateTotalPrice();
    };

    transferOption.onchange = () => {
        calculateTotalPrice();
    };

    orderBtn.onclick = () => {
        if (isNaN(form.get('price'))) return;

        modal.toggle();
        addOrder(form);
    };

    calculateTotalPrice(form);
}

function displayGuideTable(data, routeData, currentPage, pageSize, totalPages) {
    document.getElementById('guidesSection').classList.remove('d-none');
    const cnt = document.getElementById('guides-list');
    cnt.innerHTML = '';
    cnt.scrollIntoView({ behavior: 'smooth' });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);

    for (let i = startIndex; i < endIndex; i++) {
        const element = data[i];

        const workExperience = pluralize(
            element.workExperience,
            ['года', 'год', 'лет']
        );

        let row = `
            <td class="p-2 border">
                <img src="${element.profileImage}" alt="Profile Image" class="profile-image">
            </td>
            <td class="p-2 border">${element.name}</td>
            <td class="p-2 border d-none d-sm-table-cell">${element.language}</td>
            <td class="p-2 border d-none d-md-table-cell">${workExperience}</td>
            <td class="p-2 border">${element.pricePerHour}р/час</td>
            <td class="p-2 border">
                <button class="btn btn-outline-primary" onclick="selectGuide(${element.id}, '${element.name}', ${element.pricePerHour}, ${routeData.id}, '${routeData.name}')">Выбрать</button>
            </td>`;
        cnt.insertAdjacentHTML("beforeend", row);
    }

    //getGuidesData(routeData, 1, 10) 
    /*
    const paginationCnt = document.getElementById('pagination');
    paginationCnt.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = paginationCnt.appendChild(
            document.createElement('button')
        );
        pageBtn.className = `btn btn-outline-primary ${currentPage === i ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            getGuidesData(routeData, i, pageSize);
        }
    }
    */
}

function calculateTotalPrice(form) {
    const discountOption = document.getElementById('discountOption');
    const transferOption = document.getElementById('transferOption');

    const basePrice = form.get('basePrice');
    let finalPrice = basePrice;

    if (discountOption.checked) {
        finalPrice -= finalPrice * 0.25;
    }

    if (transferOption.checked) {
        const day = new Date(form.get('date')).getDay();
        const isWeekend = day === 0 || day === 6;

        if (isWeekend) {
            finalPrice *= 1.25;
        } else {
            finalPrice *= 1.3;
        }
    }

    form.set('finalPrice', finalPrice);
    updateOrderPrice(finalPrice);
}

function selectGuide(guideId, guideName, guidePricePerHour, routeId, routeName, modal) {
    // Ваш код для обработки выбора гида с указанным ID
    console.log(`Выбран гид с ID ${guideId}`);
    // Добавьте здесь логику, которую вы хотите выполнить при выборе гида

    const selectedGuideButton = document.getElementById(`select-guide-${guideId}`);
    //selectedGuideButton.classList.add('selected');
    
    const orderButton = document.getElementById('confirmOrderBtn');
    orderButton.classList.remove('d-none');
    orderButton.onclick = () => {
        let modal = document.getElementById("guideModal");
        showModal(guideId, guideName, guidePricePerHour, routeId, routeName, modal);
    };
}

function displayRouteTable(data) {
    const cnt = document.getElementById('routes-list');
    cnt.innerHTML = '';
    for (let element of data) {
        const routeCnt = cnt.appendChild(
            document.createElement('tr')
        );

        let row = `
            <td class="p-3 border">${element.name}</td>
            <td class="p-3 d-none d-md-table-cell border">${element.description}</td>
            <td class="p-3 d-none d-lg-table-cell border">${element.mainObject}</td>`;
        routeCnt.insertAdjacentHTML("beforeend", row);

        const routeChoise = routeCnt.appendChild(
            document.createElement('button')
        );
        routeChoise.className = 'btn btn-outline-primary';
        routeChoise.textContent = 'Выбрать';
        routeChoise.onclick = () => {
            getGuidesData(element);
        };
    }
}

function getRouteData(pageNumber = 1, pageSize = 10) {
    fetch(
        `${domain}/api/routes?api_key=${key}`
    )
        .then((response) => { 
            if (!response.ok) { 
                throw new Error(`Ошибка ${response.status}`); 
            } 
            return response.json(); 
        }) 
        .then((data) => { 
            console.log(data); 
            displayRouteTable(data);
        })
        .catch(error => {
            console.error('Ошибка получения данных о маршрутах:', error);
        }); 
}

function getGuidesData(routeData, pageNumber = 1, pageSize = 10) {
    fetch(
        `${domain}/api/routes/${routeData.id}/guides?api_key=${key}`
    )
        .then((response) => { 
            if (!response.ok) { 
                throw new Error(`Ошибка ${response.status}`); 
            } 
            return response.json(); 
        }) 
        .then((data) => {
            const totalPages = Math.ceil(data.length / pageSize);
            displayGuideTable(data, routeData, currentPage, pageSize, totalPages);
        })
        .catch(e => console.log(e));
}

function updateOrderPrice(price) {
    const orderPrice = document.getElementById('order-price');
    const orderBtn = document.getElementById('order-send');

    if (isNaN(price)) {
        orderBtn.classList.remove('btn-primary');
        orderBtn.classList.add('btn-secondary');
        orderPrice.textContent = 'NaN';
    } else {
        orderBtn.classList.add('btn-primary');
        orderBtn.classList.remove('btn-secondary');
        orderPrice.textContent = `${price}р`;
    }
}

function addOrder(data) {
    fetch(
        `${domain}/api/orders?api_key=${key}`,
        { method: 'POST', body: data}
    )
        .then((response) => { 
            if (!response.ok) { 
                throw new Error(`Ошибка ${response.status}`); 
            } 
            return response.json();
        }) 
        .then((data) => {
            createAlert(
                'Заявка успешно создана',
                'success'
            );
            console.log(data);
        })
        .catch(e => {
            createAlert(
                'Во время заполнения заявки произошла ошибка. Попробуйте снова',
                'warning'
            );
        });
}

function createAlert(text, type) {
    const cnt = document.getElementById('alerts').appendChild(
        document.createElement('div')
    );
    const raw = `
        <div class="alert alert-${type} alert-dismissible" role="alert" >
            <div>${text}</div>
            <button class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    cnt.insertAdjacentHTML("beforeend", raw);
}

getRouteData(currentPage, pageSize);
//getGuidesData(routeData, currentPage, pageSize);
