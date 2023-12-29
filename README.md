# Vite

## Установка, беглый обзор

Создание Vite-проекта:

```bash
bunx create-vite
```

### Структура проекта

`index.html` - главный (root) файл проекта, подключащий JS-модуль:

```html
<script type="module" src="/main.js"></script>
```

В `main.js` используется импорт/экспорт ESModule'ей:

- Стили импортируемых `css`-файлов Vite загружает в HTML;

- Импорт изображений возвращает путь к статическому файлу.

- Импорт из `/public` (например `import img from '/img.jpg'`) vite возвращает в оригинальном непреобразованном виде (статика).

### Vite inspect plugin

Позволяет просматриваеть преобразования Vite кода загружаемых в браузер модулей.

```bash
bun add -D vite-plugin-inspect
```

```javascript
// vite.config.js
import Inspect from 'vite-plugin-inspect'

export default {
  plugins: [
    Inspect()
  ],
}
```

Инспектор доступен по адресу: `http://localhost:5173/__inspect`.

## Импорт и команды

### Команды Vite

- `vite serve` - запуск dev-сервера (или просто `vite`). Dev-сервер _Vite_ из коробки поддерживает HMR.

- `vite build` - сборка для production с оптимизацией;

- `vite preview` - запуск статического сервера с демонстрацией собранного production-проекта.

Все команды запускают бинарный скрипт `/node_modules/.bin/vite`.

### Импорт модулей

За счёт атрибута `type="module"` тега `<script>` в загружаемом скрипте можно использовать импорт/экспорт ES-модулей.

При импорте сторонних пакетов (из директории `node_modules`), vite помещает импортируемые зависимости в `node_modules/.vite/deps` и импортирует преобразованный модуль оттуда:

```javascript
// оригинальный код
import collect from 'collect.js'
```

```javascript
// преобразованый импорт
import __vite__cjsImport0_collect_js from "/node_modules/.vite/deps/collect__js.js?v=018f8eaa";
// присваивание импортируемого модуля константе "collect" (как в оригинальном коде) 
const collect = __vite__cjsImport0_collect_js.__esModule ? __vite__cjsImport0_collect_js.default : __vite__cjsImport0_collect_js;
```

## Работа с CSS

### Добавление CSS в HTML-код

CSS импортируется как обычный ES-модуль в `main.js`:

```javascript
import './src/assets/style.css'
```

_Vite_ преобразует css в JavaScript-код, присваивая css-строки константе `__vite__css`:

```javascript
const __vite__css = "body {\n    background-color: #18181D;\n    color: white;\n}\n"
```

Далее _Vite_ производит inline-вставку css-кода из константы `__vite__css`:

```html
<style type="text/css" data-vite-dev-id="/home/arthur/dev/vite-learning/src/assets/03.css">
body {
    background-color: #18181D;
    color: white;
}
</style>
```

### Получение CSS-кода без добавления в HTML

```javascript
import styles from './src/assets/style.css?inline';
console.log(styles);
// добавление в html-код стилей вручную
const styleEl = document.createElement('style');
styleEl.innerText = styles;
document.querySelector('head').append(styleEl);
```

## CSS-модули

СSS-модули:

```css
/* a.module.css */
.heading {
    font-size: 30;
}
```

```css
/* b.module.css */
.heading {
    color: red;
}
```

Импорт и работа с CSS-модулями:

```javascript
import stylesA from './src/assets/a.module.css';
import stylesB from './src/assets/b.module.css';
// получаем значения с уникальными названиями классов,
// которые добавляются в отдельные теги <style> в HTML-файле
console.log(stylesA); // { heading: '_heading_i0ouq_1' }
console.log(stylesB); // { heading: '_heading_1nd3s_1' }
```

```javascript
// применение уникальных классов модулей к HTML-элементу
document.querySelector('.heading').className = `${stylesA.heading} ${stylesB.heading}`;
```

Теперь HTML-элемент будет выглядить примерно так:

```HTML
<!-- конфликтный класс .heading заменен на два уникальных класса -->
<h1 class="_heading_1nd3s_1 _heading_i0ouq_1">Hello, Vite!</h1>
```

Можно пользоваться диструктуризацией импортируемого объекта:

```javascript
// возвращается { heading: 'uniq_class_name' }
import { heading as fontSize } from './src/assets/04a.module.css';
import { heading as textColor } from './src/assets/04b.module.css';
document.querySelector('.heading').className = `${fontSize} ${textColor}`;
```