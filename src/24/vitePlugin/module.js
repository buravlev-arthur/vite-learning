import './submodule.js';

export const message = 'message from module.js';

export default 'default message from module.js';

let styles;

const addStylesheet = () => {
    console.log('add stylesheet');
    styles = document.createElement('style');
    styles.textContent = 'body { background: #000; color: yellow }';
    document.head.append(styles);
};

const removeStylesheet = () => {
    console.log('remove stylesheet');
    styles.remove()
};

addStylesheet();

console.log('from module.js');

// реализация HMR в модуле module.js
if (import.meta.hot) {
    // обработка HMR при обновлении данного модуля
    import.meta.hot.accept((updatedModuleData) => {
        if (updatedModuleData) { // при ошибке в модуле значением будет undefined
            console.log(updatedModuleData);
        }
    });

    // обработка HMR при обновлении импортируемых модулей
    // 1 параметр - массив с адресами модулей, для которых нужен HMR
    import.meta.hot.accept(['./submodule.js'], ([subModuleUpdatedData]) => {
        if (subModuleUpdatedData) { // при ошибке в модуле значением будет undefined
            console.log(subModuleUpdatedData);
        }
    });

    // избавляемся от побочных эффектов модуля (удаляем DOM-элемент со стилями)
    import.meta.hot.dispose(() => {
        removeStylesheet();
    })

    // прослушивание предустановленных событий
    import.meta.hot.on('vite:beforeUpdate', (data) => {
        console.log('beforeUpdate: ', data);
    });

    import.meta.hot.on('vite:afterUpdate', (data) => {
        console.log('afterUpdate: ', data);
    });

    import.meta.hot.on('vite:error', (data) => {
        console.log('error: ', data);
    });
};
