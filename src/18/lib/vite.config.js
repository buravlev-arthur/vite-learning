export default {
    build: {
        lib: {
            // пути к js-файлам с кодом пакета
            entry: [
                new URL('src/pluck.js', import.meta.url).pathname,
                new URL('src/log.js', import.meta.url).pathname,
            ],
            name: 'Pluck', // название библиотеки
            /**
             * Метод генерирует модули в сборке из исходных в массиве "entry"
             * @param format - формат модуля (es, cjs и т.п.)
             * @param name - имя оригинального модуля
             * @returns 
             */
            fileName: (format, name) => {
                if (format === 'es') {
                    return `${name}.js`
                }
                return `${name}.${format}`
            }
        },
        rollupOptions: {
            // исколючаем пакет collect.js из сборки
            external: ['collect.js']
        },
    },
};
