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

## PostCSS плагины

При импорте CSS-файлов к ним применяются трансформации с помощью утилиты PostCSS. Соответственно, в _Vite_ можно использовать PostCSS-плагины.

Установка и инициализация Tailwindcss:

```bash
bun i -D tailwindcss postcss autoprefixer
# создаст postcss.config.js и tailwind.config.js в корне Vite-проекта
bunx tailwindcss init -p
```

Теперь при трансформации импортируемых css-модулей будут учитываться настройки из `postcss.config.js`. По умолчанию в `postcss.config.js` добавлены два плагина:

- `tailwindcss` (обеспечивает работы tailwind-классов)

- `autoprefixer` (добавляет префиксы к некоторым css-свойствам для разных браузеров)

В `tailwind.config.js` необходимо указать, в каких файлах будут использоваться tailwind-классы:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html']
}
```

Для работы tailwind-классов нужно в корневой css-файл добавить его директивы:

```css
/* /src/assets/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

В `/index.html` теперь можно использовать tailwind-классы и они будут трансформированы "на лету" в стили с помощью чтения конфигурации из `postcss.config.js` и использования подключенных в нём postcss-плагинов:

```html
<!-- задание тегу body цвета фона и текста в index.html-->
<body class="bg-[#18181A] text-white"></body>
```

## CSS препроцессоры

_Vite_ поддерживает несколько CSS-препроцессоров: LESS, SASS, Stylys. Для их использования достаточно просто установить нужную зависимость с выбранным препроцессором:

```bash
bun i -D sass
```

Аналогично с css-модулями, в _Vite_ можно использовать модули препроцессоров:

```sass
/* /src/assets/style.module.sass */
.class-name
    font-size: 30
    color: white
```

```javascript
import style from '/src/assets/style.module.sass';
console.log(style); // { "class-name": "_class_name_fw9yu_1" }
document.body.className = style['class-name']; // добавляем уникальный класс к body
```

## Импорт JSON

_Vite_ при импорте `json`-файлов преобразует их в ES-модули с экспоротом всех JSON-полей и всей структуры JSON в виде валидного объекта.

```javascript
import data from './data.json';
import { name, age } from './data.json' // можно делать деструктуризацию
import url from './data.json?url' // получить путь к json-файлу
console.log(data); // { name: "John", age: 40 }
console.log(name, age); // John 40
console.log(url); // /src/assets/data.json
```

## Импорт файлов (статические ассеты)

По умолчанию _Vite_ экспортирует (export default) путь к файлу:

```javascript
import svgImg from './assets/img/testSVG.svg';
console.log(svgImg); // image url
```

Можно присвоить путь к src-атрибут в HTML:

```html
<img id="svg-img" />
```

```javascript
import svgImg from './assets/img/testSVG.svg';
document.getElementById('svg-img').src = svgImg;
```

Можно получить исходный код файла (например, svg-данные) с помощью параметра `raw` в импорте:

```javascript
import svgSource from './assets/img/testSVG.svg?raw'
console.log(svgSource); // <svg>...</svg>
```

## Директория public

Статические файлы, которые не будут импортироваться в исходный код (как ES-модули после их преобразования с помощью _Vite_), но будут использоваться в приложении, должны храниться в директории `/public`. Файл `/public/img.jpg` в браузере можно будет получить по адресу `domain.name/img.jpg`.

Статические файлы, импортируемые в модули проекта (обычно размещаются в `/src/assets`) изменют имена и добавляют к ним хэш в процессе сборки. Поэтому обратиться к ним напрямую из браузера нельзя.


Пример использования статического файла из `/public` в HTML-коде:

```html
<img src="vite.svg" />
```

Имя директории со статикой можно переименовать с `public` на любое другое:

```javascript
// vite.config.js
export default {
  publicDir: 'build'
}
```
