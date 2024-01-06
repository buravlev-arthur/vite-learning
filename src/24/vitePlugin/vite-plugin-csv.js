import { parse } from 'csv-parse/sync';

export default () => {
    // будет определен в хуке "configResolve"
    let config = null;

    return {
        // название плагина
        name: 'csv',

        // когда использовать плагин (в процессе разработки - "server", при сборке - "build")
        // apply: 'build',

        /*
            Функция-замыкание
            config - конфигурационный объект (plugins, mode, server, optimizeDeps)
            command - команда запуска (serve, build)
            mode - режим исполнения приложения (development, production)
        */
        // apply(config, { command, mode }) {
        //     return mode === 'production'
        // },

        /* Хук, получающий данные конфигурации и присваивающий значение переменной config
        для дальнейшего использования данных конфигурация в других хуках */
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },

        /**
         * Hook-функция, выполняемая при каждом импорте любых модулей в js-файлах
         * @param src - содержимое импортируемого подуля
         * @param id - путь к данному модулую
         */
        transform(src, id) {
            // использования данных конфигурации из "configResolve"
            const columns = config.command === 'serve'

            // если импортируется модуль с расширением .csv
            if (/\.csv$/.test(id)) {
                /* парсинг csv-контента при помощи пакета "csv-parse"
                с добавленим названия колонок как поля в объекта */
                const records = parse(src, { columns })

                return {
                    // экпорт данных в виде строки, чтобы их можно было импортировать в другой модуль
                    code: `export default ${JSON.stringify(records)}`,

                }
            }
        },

        // Хук для преобразования index.html (параметр html)
        transformIndexHtml(html) {
            // console.log(html); // html-код из index.html
            return html.replace('</body>', '<script>alert("transformIndexHtml");</script></body>');
        }
    }
};
