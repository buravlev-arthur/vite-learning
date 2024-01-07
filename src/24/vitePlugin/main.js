import products from './products.csv';

document.querySelector('pre').textContent = JSON.stringify(products);

// проверяем, существует ли Vite-объект "hot", отвечающий за горячую замену модулей
if (import.meta.hot) {
    console.log('import.meta.hot is suppoted');

    // слушаем событие "connected" (сообщение сервера)
    import.meta.hot.on('connected', (message) => {
        console.log(message);
    });

    // отправляем сообщение серверу (событие "ping")
    import.meta.hot.send('ping', 'Hello, server!');

    // слушаем ответ сервера на сообщение (вызываемое событие "ping")
    import.meta.hot.on('pong', (message) => {
        console.log(message);
    });

    /* прослушиваем событие "csv-update" (указано в конфигурации сообщения)
    url - путь к обновленному модулю
    data - обновленные данные импортируемого модуля, переденные в поле "data" ws-сообщения */
    import.meta.hot.on('csv-update', ({ url, data }) => {
        console.log(`[vite] hot updated: ${url}`);
        document.querySelector('pre').textContent = JSON.stringify(data);
    });
}