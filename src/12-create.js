/**
 * Функция для генерации DOM-элементов из JSX-данных (определена в vite.config.js)
 * @param el - название элемента
 * @param attrs - атрибуты элемента
 * @param content - содержимое элемента
 */
export default function create(el, attrs, content) {    
    // создаём элемент
    const node = document.createElement(el);
    // добавляем атрибуты
    Object.entries(attrs || {}).forEach(([name, value]) => {
        node.setAttribute(name, value);
    });
    // если у элемента есть текстовый контент
    if (typeof content === 'string') {
        // создаём текстовый элемент и добавляем его в основной элемент
        const textNode = document.createTextNode(content);
        node.appendChild(textNode);
    } else {
        // если у элемента есть дочерний элемент (в виде объекта) - добавляем его тоже
        node.appendChild(content);
    }

    return node;
}