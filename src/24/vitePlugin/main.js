import products from './products.csv';

document.querySelector('pre').textContent = JSON.stringify(products);

// проверяем, существует ли Vite-объект "hot", отвечающий за горячую замену модулей
if (import.meta.hot) {
    /* прослушиваем событие "csv-update" (указано в конфигурации сообщения)
    url - путь к обновленному модулю
    data - обновленные данные импортируемого модуля, переденные в поле "data" ws-сообщения */
    import.meta.hot.on('csv-update', ({ url, data }) => {
        console.log(`[vite] hot updated: ${url}`);
        document.querySelector('pre').textContent = JSON.stringify(data);
    });
}