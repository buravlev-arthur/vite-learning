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

## Объект Glob

С помощью функции `glob()` объекта `import` можно импортировать сразу несколько объектов:

```javascript
// импорти всех .js-модулей из директории src
const modules = import.meta.glob('/src/*.js'); // { '/src/module.js': () => import('/src/module.js'), ... }
```

Загрузить модули и получить их данные:

```javascript
const modules = import.meta.glob('/src/*.js');
Object.values(modules).forEach(async (module) => {
    const moduleData = await module(); // загружаем модуль
    console.log(moduleData); // выводим объект с экспортируемыми данными модуля в консоль
});
```

Загрузку модулей можно повесить на какое-либо событие:

```javascript
document.addEventListener('click', () => {
  Object.values(modules).forEach(async (module) => { await module() });
})
```

### Статическая загрузка модулей

Можно отключить асинхронную загрузку модулей и загружать их сразу c помощью `eager` в значении `true`. 
В возвращаем объекте значениями будут экспортируемые данных загруженных модулей.

```javascript
const modules = import.meta.glob('/src/*.js', { eager: true });
console.log(modules); // { '/src/module.js': () => { export1: value, ... }, ... }
```

В этом случае динамические импорты (`() => import('/src/module.js')`) заменены на статические импорты:

```javascript
import * as __vite_glob_0_0 from '/src/module.js'
```

### Строковое представление модулей

```javascript
const modules = import.meta.glob('/src/10/*.js', { as: 'raw', eager: true });
console.log(modules); // { '/src/module.js': () => 'export default 2;', ... }
```

### URL модулей

```javascript
const urls = import.meta.glob('/src/10/*.js', { as: 'url', eager: true });
console.log(urls); // { '/src/module.js': () => '/src/10/module.js?t=1029481002007', ... }
```

### Получение выбранных экспортов

```javascript
// предполагается, что в каждом модуле есть экспортируемая переменная/константа "name"
const names = import.meta.glob('/src/10/*.js', { import: 'name', eager: true });
// импорт значений, экспортируемых по умолчанию (export default)
const defaults = import.meta.glob('/src/10/*.js', { import: 'default', eager: true });
```

## JSX

Для интепретации `.jsx`-модулей, _Vite_ использует _esbuild_. В `vite.config.js`, в свойстве `jsxFactory` указываем функцию, которая должна быть вызвана для обработки JSX-данных:

```javascript
// vite.config.js
export default {
  esbuild: {
    // функция для обработки JSX с названием: "create"
    jsxFactory: 'create'
  }
}
```

Сама функция должна быть определена в коде JSX-модуля (или импортирована в JSX-модуль) и принимать три параметра:

- `el` - название элемента

- `attrs` - атрибуты элемента

- `content` - содержимое элемента

```javascript
function create(el, attrs, content) {
    console.log(el, attrs, content); // a { href: "#" } link
}
```

Задача функции "create" состоит в формировании DOM-элементов (с учетом вложенности) из JSX-данных. Пример полной функции "create":

```javascript
function create(el, attrs, content) {    
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
```

Добавляем сформированный из JSX-данных HTML-код в документ:

```html
<div id="app"></div>
```

```javascript
import { template } from '/src/element.jsx';
console.log(template.outerHTML); // текстовый вывод html
document.querySelector('#app').appendChild(template); // добавляем DOM-дерево в div с id="app"
```

Чтобы не импортировать в каждый JSX-модуль функцию "create", её импорт можно вынести в специальное поле `jsxInject` в `vite.config.js`:

```javascript
export default {
  esbuild: {
    jsxFactory: 'create',
    jsxInject: 'import create from "/src/create.js"', // этот импорт будет добавлен во все JSX-модули
  }
}
```

## Typescript

По-умолчанию _Vite_ не проверяет код на соотвествие типов, а лишь преобразует ts-код в js-код для оптимизиции скорости обновлений приложения.
Проверку типов в _Vite_ рекомендуется делать в отдельном процессе.

Для преобразования typescript в javascript _Vite_ использует _esbuild_ вместо _tsc_, который значительно быстрее.

Для проверки типов нужно установить typescript:

```bash
bun i -D typescript
```

Далее нужно определить сценарий вызова ts-компилятора с отключенной компиляцией (флаг `--noEmit`) в `package.json`:

```json
{
  "scripts": {
    "tsc": "tsc --noEmit"
  }
}
```

И определить конфигурационный файл `tsconfig.json` с содержимым:

```json
{
  "compilerOptions": {
    // Указываем, в какой директории находятся typescript-файлы для проверки
    "rootDir": "./"
  }
}
```

Теперь можно осуществлять проверку типов:

```bash
bun run tsc
```

Автоматическая проверка типов при каждом изменении ts-модулей:

```bash
bun run tsc -- --watch
```

### Интеграция проверки типов в процесс сборки

Для интеграции проверки типов в процесс сборки приложения используется плагин: `vite-plugin-checker`:

```bash
bun i -D vite-plugin-checker
```

Подключить плагин в `vite.config.js`:

```javascript
import typeChecker from 'vite-plugin-checker';

export default {
  plugins: [
    typeChecker({
      typescript: true,
    })
  ],
}
```

## ESLint

Для статической проверки _ESLint_ ts-файлов, используется инструмент: [typescript-eslint](https://typescript-eslint.io/).

Установка зависимостей:

```bash
bun i -D  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Конфигурационный файл `.eslintrc.cjs` в корне проекта:

```cjs
/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};
```

Запуск проверки:

```bash
# "." - искать файлы для проверки в корне проекта
bunx eslint .
```

Для игнорирования js-файлов нужно создать `.eslintignore` с содержимым:

```
*.js
```

### Интеграция ESLint в процесс сборки

Для интеграции ESLint в процесс сборки необходимо установить зависимость `eslint` и добавить в конфигурацию плагина `vite-plugin-checker` настройки запуска eslint:

```javascript
import typeChecker from 'vite-plugin-checker';
export default {
  plugins: [
    typeChecker({
      eslint: {
        lintCommand: 'eslint "./**/*.{ts,tsx}"'
      }
    })
  ],
}
```


## Псевдонимы путей

Использование псевдонима пути `@`:

```javascript
// /src/assets/style.css
import '@/style.css';
```

Конфигурирование псевдонима `@` в `vite.config.js`:

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      '@': new URL('src/assets', import.meta.url).pathname
    }
  }
}
```

## Переменные окружения

_Vite_ переменные окружения хранит в объекте `import.meta.env`:

```javascript
// Все доступные переменные окружения
console.log(import.meta.env);
```

Проверить текущую среду (development или production):

```javascript
const envVars = import.meta.env;
const isDev = envVars.DEV && envVars.MODE === 'development';
const isProd = envVars.PROD && envVars.MODE === 'production';
```

Свои переменные окружения нужно указывать в файле `.env` (в корне проекта) с обязательным префиксом `VITE_`:

```text
VITE_VAR="Test"
```

Префикс переменных можно переопределить:

```javascript
// vite.config.js
export default {
  envPrefix: 'APP_', // Пример переменной в .env-файле: APP_TEST="test"
}
```

Для каждой среды можно определить свой `.env`-файл:

- `.env.development`

- `.env.production`

- `.env.staging` (кастомная среда)

Или эти же файлы с игнорированием git:

- `.env.local`

- `.env.production.local`

Для запуска сборки в кастомном режиме, нужно указать параметр `--mode`:

```bash
vite build --mode staging
```

Переменные окружения можно также указывать в команде запуска _Vite_ проекта:

```bash
# данное значение имеет приоритет на определенной с таким же названием в .env-файлах
VITE_TEST_VAR=value bun run build
```

К переменным окружения можно получить доступ в HTML:

```html
<p>%VITE_VAR%</p>
```

## Многостраничная сборка

Для добавления новой страницы нужно создать директорию с содержимым:

```
/page
  -- index.html
  -- page.js
```

И в `vite.config.js` указать пути к главной и новой страницам:

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        'main': new URL('index.html', import.meta.url).pathname,
        'page': new URL('page/index.html', import.meta.url).pathname
      }
    }
  }
}
```
