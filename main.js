// Пример данных о маршрутах (замените данными из вашего приложения)
let routesData = [
    { id: 1, name: 'Маршрут 1' },
    { id: 2, name: 'Маршрут 2' },
    // Добавьте другие маршруты по аналогии
];

// Пример данных о гидах (замените данными из вашего приложения)
let guidesData = [
    { id: 1, name: 'Гид 1' },
    { id: 2, name: 'Гид 2' },
    // Добавьте других гидов по аналогии
];

// Пример данных о заявках (замените данными из вашего приложения)
let requestsData = [
    { id: 1, route: 'Маршрут 1', guide: 'Гид 1', date: '01.01.2022', cost: '1000', status: 'Активна' },
    { id: 2, route: 'Маршрут 2', guide: 'Гид 2', date: '02.01.2022', cost: '1500', status: 'Активна' },
    // Добавьте другие заявки по аналогии
];

// Функция для отображения заявок в таблице
function displayRequests() {
    const tableBody = document.getElementById('requestsTable');
    tableBody.innerHTML = ''; // Очистка содержимого таблицы перед обновлением

    requestsData.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${request.id}</th>
            <td>${request.route}</td>
            <td>${request.guide}</td>
            <td>${request.date}</td>
            <td>${request.cost}</td>
            <td>${request.status}</td>
            <td>
                <button type="button" class="btn btn-info btn-sm" onclick="showDetails(${request.id})">Подробнее</button>
                <button type="button" class="btn btn-warning btn-sm" onclick="editRequest(${request.id})">Редактировать</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteRequest(${request.id})">Удалить</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Функция для отображения подробной информации о заявке в модальном окне
function showDetails(requestId) {
    const request = requestsData.find(r => r.id === requestId);

    const detailsModalContent = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="detailsModalLabel">Подробная информация</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Название маршрута:</strong> ${request.route}</p>
                    <p><strong>Гид:</strong> ${request.guide}</p>
                    <p><strong>Дата экскурсии:</strong> ${request.date}</p>
                    <p><strong>Итоговая стоимость:</strong> ${request.cost}</p>
                    <p><strong>Статус:</strong> ${request.status}</p>
                </div>
            </div>
        </div>
    `;

    // Очищаем и обновляем контент модального окна
    document.getElementById('detailsModal').innerHTML = detailsModalContent;

    // Открываем модальное окно
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

// Функция для редактирования заявки
function editRequest(requestId) {
    const request = requestsData.find(r => r.id === requestId);

    // Здесь можно добавить код для открытия модального окна редактирования заявки
    // Например, используя $('#editModal').modal('show') и соответствующий HTML-код
    const editModalContent = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Редактирование заявки</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <div class="mb-3">
                            <label for="editRoute" class="form-label">Название маршрута</label>
                            <select class="form-select" id="editRoute" required>
                                ${generateRouteOptions(request.route)}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editGuide" class="form-label">Гид</label>
                            <select class="form-select" id="editGuide" required>
                                ${generateGuideOptions(request.guide)}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editDate" class="form-label">Дата экскурсии</label>
                            <input type="text" class="form-control" id="editDate" value="${request.date}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editCost" class="form-label">Итоговая стоимость</label>
                            <input type="text" class="form-control" id="editCost" value="${request.cost}" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Очищаем и обновляем контент модального окна
    document.getElementById('editModal').innerHTML = editModalContent;

    // Подписываемся на событие отправки формы
    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Получаем значения из формы
        const editedRoute = document.getElementById('editRoute').value;
        const editedGuide = document.getElementById('editGuide').value;
        const editedDate = document.getElementById('editDate').value;
        const editedCost = document.getElementById('editCost').value;

        // Обновляем значения в массиве данных
        request.route = editedRoute;
        request.guide = editedGuide;
        request.date = editedDate;
        request.cost = editedCost;

        // Обновляем таблицу
        displayRequests();

        // Закрываем модальное окно
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.hide();
    });

    // Открываем модальное окно
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

// Функция для удаления заявки
function deleteRequest(requestId) {
    const request = requestsData.find(r => r.id === requestId);

    const confirmed = confirm('Вы уверены, что хотите удалить эту заявку?');
    
    if (confirmed) {
        // Фиктивно устанавливаем статус "Удалена"
        request.status = 'Удалена';

        // Обновляем таблицу
        displayRequests();
    }
}

// Функция для генерации HTML-кода с опциями для выбора маршрута
function generateRouteOptions(selectedRoute) {
    return routesData.map(route => `<option value="${route.id}" ${route.name === selectedRoute ? 'selected' : ''}>${route.name}</option>`).join('');
}

// Функция для генерации HTML-кода с опциями для выбора гида
function generateGuideOptions(selectedGuide) {
    return guidesData.map(guide => `<option value="${guide.id}" ${guide.name === selectedGuide ? 'selected' : ''}>${guide.name}</option>`).join('');
}

// Вызов функции для отображения заявок при загрузке страницы
displayRequests();
