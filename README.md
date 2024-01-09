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
import Inspect from "vite-plugin-inspect";

export default {
  plugins: [Inspect()],
};
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
import collect from "collect.js";
```

```javascript
// преобразованый импорт
import __vite__cjsImport0_collect_js from "/node_modules/.vite/deps/collect__js.js?v=018f8eaa";
// присваивание импортируемого модуля константе "collect" (как в оригинальном коде)
const collect = __vite__cjsImport0_collect_js.__esModule
  ? __vite__cjsImport0_collect_js.default
  : __vite__cjsImport0_collect_js;
```

## Работа с CSS

### Добавление CSS в HTML-код

CSS импортируется как обычный ES-модуль в `main.js`:

```javascript
import "./src/assets/style.css";
```

_Vite_ преобразует css в JavaScript-код, присваивая css-строки константе `__vite__css`:

```javascript
const __vite__css =
  "body {\n    background-color: #18181D;\n    color: white;\n}\n";
```

Далее _Vite_ производит inline-вставку css-кода из константы `__vite__css`:

```html
<style
  type="text/css"
  data-vite-dev-id="/home/arthur/dev/vite-learning/src/assets/03.css"
>
  body {
    background-color: #18181d;
    color: white;
  }
</style>
```

### Получение CSS-кода без добавления в HTML

```javascript
import styles from "./src/assets/style.css?inline";
console.log(styles);
// добавление в html-код стилей вручную
const styleEl = document.createElement("style");
styleEl.innerText = styles;
document.querySelector("head").append(styleEl);
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
import stylesA from "./src/assets/a.module.css";
import stylesB from "./src/assets/b.module.css";
// получаем значения с уникальными названиями классов,
// которые добавляются в отдельные теги <style> в HTML-файле
console.log(stylesA); // { heading: '_heading_i0ouq_1' }
console.log(stylesB); // { heading: '_heading_1nd3s_1' }
```

```javascript
// применение уникальных классов модулей к HTML-элементу
document.querySelector(
  ".heading"
).className = `${stylesA.heading} ${stylesB.heading}`;
```

Теперь HTML-элемент будет выглядить примерно так:

```HTML
<!-- конфликтный класс .heading заменен на два уникальных класса -->
<h1 class="_heading_1nd3s_1 _heading_i0ouq_1">Hello, Vite!</h1>
```

Можно пользоваться диструктуризацией импортируемого объекта:

```javascript
// возвращается { heading: 'uniq_class_name' }
import { heading as fontSize } from "./src/assets/04a.module.css";
import { heading as textColor } from "./src/assets/04b.module.css";
document.querySelector(".heading").className = `${fontSize} ${textColor}`;
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
  content: ["./index.html"],
};
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
import style from "/src/assets/style.module.sass";
console.log(style); // { "class-name": "_class_name_fw9yu_1" }
document.body.className = style["class-name"]; // добавляем уникальный класс к body
```

## Импорт JSON

_Vite_ при импорте `json`-файлов преобразует их в ES-модули с экспоротом всех JSON-полей и всей структуры JSON в виде валидного объекта.

```javascript
import data from "./data.json";
import { name, age } from "./data.json"; // можно делать деструктуризацию
import url from "./data.json?url"; // получить путь к json-файлу
console.log(data); // { name: "John", age: 40 }
console.log(name, age); // John 40
console.log(url); // /src/assets/data.json
```

## Импорт файлов (статические ассеты)

По умолчанию _Vite_ экспортирует (export default) путь к файлу:

```javascript
import svgImg from "./assets/img/testSVG.svg";
console.log(svgImg); // image url
```

Можно присвоить путь к src-атрибут в HTML:

```html
<img id="svg-img" />
```

```javascript
import svgImg from "./assets/img/testSVG.svg";
document.getElementById("svg-img").src = svgImg;
```

Можно получить исходный код файла (например, svg-данные) с помощью параметра `raw` в импорте:

```javascript
import svgSource from "./assets/img/testSVG.svg?raw";
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
  publicDir: "build",
};
```

## Объект Glob

С помощью функции `glob()` объекта `import` можно импортировать сразу несколько объектов:

```javascript
// импорти всех .js-модулей из директории src
const modules = import.meta.glob("/src/*.js"); // { '/src/module.js': () => import('/src/module.js'), ... }
```

Загрузить модули и получить их данные:

```javascript
const modules = import.meta.glob("/src/*.js");
Object.values(modules).forEach(async (module) => {
  const moduleData = await module(); // загружаем модуль
  console.log(moduleData); // выводим объект с экспортируемыми данными модуля в консоль
});
```

Загрузку модулей можно повесить на какое-либо событие:

```javascript
document.addEventListener("click", () => {
  Object.values(modules).forEach(async (module) => {
    await module();
  });
});
```

### Статическая загрузка модулей

Можно отключить асинхронную загрузку модулей и загружать их сразу c помощью `eager` в значении `true`.
В возвращаем объекте значениями будут экспортируемые данных загруженных модулей.

```javascript
const modules = import.meta.glob("/src/*.js", { eager: true });
console.log(modules); // { '/src/module.js': () => { export1: value, ... }, ... }
```

В этом случае динамические импорты (`() => import('/src/module.js')`) заменены на статические импорты:

```javascript
import * as __vite_glob_0_0 from "/src/module.js";
```

### Строковое представление модулей

```javascript
const modules = import.meta.glob("/src/10/*.js", { as: "raw", eager: true });
console.log(modules); // { '/src/module.js': () => 'export default 2;', ... }
```

### URL модулей

```javascript
const urls = import.meta.glob("/src/10/*.js", { as: "url", eager: true });
console.log(urls); // { '/src/module.js': () => '/src/10/module.js?t=1029481002007', ... }
```

### Получение выбранных экспортов

```javascript
// предполагается, что в каждом модуле есть экспортируемая переменная/константа "name"
const names = import.meta.glob("/src/10/*.js", { import: "name", eager: true });
// импорт значений, экспортируемых по умолчанию (export default)
const defaults = import.meta.glob("/src/10/*.js", {
  import: "default",
  eager: true,
});
```

## JSX

Для интепретации `.jsx`-модулей, _Vite_ использует _esbuild_. В `vite.config.js`, в свойстве `jsxFactory` указываем функцию, которая должна быть вызвана для обработки JSX-данных:

```javascript
// vite.config.js
export default {
  esbuild: {
    // функция для обработки JSX с названием: "create"
    jsxFactory: "create",
  },
};
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
  if (typeof content === "string") {
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
import { template } from "/src/element.jsx";
console.log(template.outerHTML); // текстовый вывод html
document.querySelector("#app").appendChild(template); // добавляем DOM-дерево в div с id="app"
```

Чтобы не импортировать в каждый JSX-модуль функцию "create", её импорт можно вынести в специальное поле `jsxInject` в `vite.config.js`:

```javascript
export default {
  esbuild: {
    jsxFactory: "create",
    jsxInject: 'import create from "/src/create.js"', // этот импорт будет добавлен во все JSX-модули
  },
};
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
import typeChecker from "vite-plugin-checker";

export default {
  plugins: [
    typeChecker({
      typescript: true,
    }),
  ],
};
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
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
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
import typeChecker from "vite-plugin-checker";
export default {
  plugins: [
    typeChecker({
      eslint: {
        lintCommand: 'eslint "./**/*.{ts,tsx}"',
      },
    }),
  ],
};
```

## Псевдонимы путей

Использование псевдонима пути `@`:

```javascript
// /src/assets/style.css
import "@/style.css";
```

Конфигурирование псевдонима `@` в `vite.config.js`:

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      "@": new URL("src/assets", import.meta.url).pathname,
    },
  },
};
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
const isDev = envVars.DEV && envVars.MODE === "development";
const isProd = envVars.PROD && envVars.MODE === "production";
```

Свои переменные окружения нужно указывать в файле `.env` (в корне проекта) с обязательным префиксом `VITE_`:

```text
VITE_VAR="Test"
```

Префикс переменных можно переопределить:

```javascript
// vite.config.js
export default {
  envPrefix: "APP_", // Пример переменной в .env-файле: APP_TEST="test"
};
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
        main: new URL("index.html", import.meta.url).pathname,
        page: new URL("page/index.html", import.meta.url).pathname,
      },
    },
  },
};
```

## Режим библиотеки

Для реализации npm-пакета в _Vite_ необходимо определить соответствующую конфигурацию в `vite.config.js`:

```javascript
export default {
  build: {
    // сообщаем Vite, что это библиотека
    lib: {
      entry: new URL("src/index.js", import.meta.url).pathname, // путь к главноему js-файлу
      name: "Pluck", // название библиотеки
      fileName: "pluck", // название js-файла после сборки
    },
  },
};
```

После сборки (`bun run build`), _Vite_ создаст два файла: `pluck.js` (ES-модуль) и `pluck.umd.cjs` (CommonJS-модуль).

Для использования библиотеки в других приложениях нужно сконфигурировать `package.json`:

```json
{
  "name": "pluck",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/pluck.umd.cjs",
  "module": "./dist.pluck.js",
  "exports": {
    ".": {
      "import": "./dist/pluck.js",
      "require": "./dist/pluck.umd.cjs"
    }
  }
}
```

C помощью команды `bun link` можно сделать покет доступным в ОС глобально доступным.

В директории клиентского приложения (которое использует пакет `pluck`), нужно выполнить команду:

```bash
bun link pluck
```

После этого в `node_modules` клиентского приложения появится ссылка на директорию с пакетом `pluck` и можно будет воспользоваться импортом:

```js
import { pluck } from "pluck";
```

### Несколько точек входа

Представим, что в библиотеке есть несколько модулей, которые экспортируют функции `pluck` и `log` соответственно:

```
/src
  -- pluck.js
  -- log.js
```

Мы хотим добиться, чтобы осуществлялись импорты из пути и подпути пакета:

```javascript
import { pluck } from "pluck";
import { log } from "pluck/log";
```

Для этого необходимо в `vite.config.js`, в `build.lib` указать в качестве значения поля `entry` массив с js-модулями и определить функцию для генерации имен модулеф в сборке в `fileName`:

```javascript
export default {
  build: {
    lib: {
      // имя пакета
      name: "Pluck",
      // пути к js-модулям с кодом пакета
      entry: [
        new URL("src/pluck.js", import.meta.url).pathname,
        new URL("src/log.js", import.meta.url).pathname,
      ],
      /**
       * Метод генерирует модули в сборке из исходных в массиве "entry"
       * @param format - формат модуля (es, cjs и т.п.)
       * @param name - имя оригинального модуля
       * @returns
       */
      fileName: (format, name) => {
        if (format === "es") {
          return `${name}.js`;
        }
        return `${name}.${format}`;
      },
    },
  },
};
```

При сборке библиотеки (`bun run build`), будут в итоге созданы четыре файла:

```
/dist
  -- pluck.js
  -- pluck.cjs
  -- log.js
  -- log.cjs
```

В файле `package.json` оставляем главным модулем `pluck.js`, и определяем доступные экспорты с собранным выше модулям:

```json
{
  "main": "./dist/pluck.cjs",
  "module": "./dist/pluck.js",
  "exports": {
    ".": {
      "import": "./dist/pluck.js",
      "require": "./dist/pluck.cjs"
    },
    "./log": {
      "import": "./dist/log.js",
      "require": "./dist/log.cjs"
    }
  }
}
```

Теперь можно воспользоваться обеими функциями в приложении:

```javascript
import { pluck } from "pluck";
import { log } from "pluck/log";

const users = [
  { name: "John", age: 0 },
  /*...*/
];

// "log" выводит в консоль результат работы "pluck"
log(pluck(users, "name"));
```

### Импорт CommonJS-модулей из библиотеки

Пакет `pluck` помимо экспорта ES-модулей, экспортирует также CommonJS-модули для NodeJS-среды. CommonJS-модули импортируются с помощью `require`:

```javascript
// main.cjs
const { pluck } = require("pluck");
const { log } = require("pluck/log");
```

Если в пакете (биболиотеке) поле "main" определно как "module" (в `package.json`), вместо значения "commonjs", модули с импортрами `require` должны быть с расшерением: `.cjs` или `.cts` (Typescript CommonJS модули).

### Сторонние пакеты в библиотеке

Необходимо обычном образом установить необходимые зависимости в библиотеку:

```bash
bun i collect.js
```

Но в таком случае в библиотеку будет включен весь код сторонних зависимостей, что увеличивает размер бандлов. Сторонние пакеты можно игнорировать при сборке библиотеке с помощью опции `build.rollupOptins.external`:

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      // исколючаем пакет collect.js из сборки
      external: ["collect.js"],
    },
  },
};
```

Все пакеты, указанные в свойстве `external` не нужно устанавливать в библиотеке.

Теперь сторонние пакеты не включены в бандлы. Но при импорте и запуске экспортов библиотеки в приложении будет появляться ошибка:

```
The following dependencies are imported bun could not be resolved:
collect.js
```

Для её устранения необходимо указать в `package.json` библиотеки, какие сторонние зависимости должно установить клиентское приложение при установке этой библиотеки с помощью поля `peerDependencies`:

```json
{
  "peerDependencies": {
    "collect.js": "^4.36.1"
  }
}
```

### Публикация библиотеки (пакета) в npm-репозитории

В имени пакета должно быть указано пространство имен, совпадающее с именем npm-пользователя. Также параметр `private` должен быть в значении `false`. А в массиве `files` нужно перечислить директории и файлы, которые нужно публиковать:

```json
{
  "name": "@username/package-name",
  "private": "false",
  "files": ["dist"]
}
```

Для публикации сначала необходимо аутентифицироваться как npm-пользователь, затем опубликовать пакет с флагом `access` со значением `public`:

```bash
# находясь в директории проекта
npm login
# после входа - сама публикация
npm publish --access public
```

Теперь этот пакет доступен для установки:

```bash
bun i @username/package-name
```

При новой публикации пакета необходимо обновлять его версию:

```bash
npm version patch #обновление третьей цифры в полной версии пакета
```

## Оптимизация изображений

Для оптимизации изображений применяется плагин: `vite-plugin-image-optimizer` и две библиотеки (`sharp`, `svgo`), которые он использует для оптимизации:

```bash
bun i -D vite-plugin-image-optimazer sharp svgo
```

Конфигурируем плагин в `vite.config.js`:

```javascript
// vite.config.js
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default {
  plugins: [
    ViteImageOptimizer({
      /* config */
    }),
  ],
};
```

Конфигурация плагина описана: [здесь](https://github.com/FatehAK/vite-plugin-image-optimizer?tab=readme-ov-file#default-configuration).

Например, для указания допустимого снижения качества JPEG-изображения подойдет следующая конфигурация:

```javascript
ViteImageOptimizer({
  jpg: {
    quality: 80,
  },
});
```

Оптимизация изображений происходит только при сборке проекта:

```bash
bun run build
```

## Создание плагина

Пример vite-плагина, преобразующего csv-данные в валидный ES-модуль (экспортируемый массив/объект). "из коробки" _Vite_ не умеет читать CSV-файлы.
Для создания плагина будем пользоваться пакетами: `vite-plugin-inspect` (vite-плагин для отслеживания преобразований модулей), `csv-parse` (парсер из CSV в массивы/объекты):

```bash
bun i vite-plugin-inspect csv-parse
```

Конфигурация `vite-plugin-inspect`:

```javascript
// vite.config.js
import Inspect from 'vite-plugin-inspect';

export default {
  plugins: [
    Inspect()
  ]
}
```

Плагин в _Vite_ - это объект с именем и методом `transform`, который вызывается при каждом импорте любого модуля:

```javascript
// vite.config.js
import { parse } from 'csv-parse/sync';

// будет определен в хуке "configResolved"
let config = null;

export default {
  plugins: [
    {
      // название плагина
      name: 'csv',

      // когда использовать плагин (в процессе разработки - "server", при сборке - "build")
      apply: 'server',

      /*
        Функция-замыкание
        config - конфигурационный объект (plugins, mode, server, optimizeDeps)
        command - команда запуска (serve, build)
        mode - режим исполнения приложения (development, production)
      */
      apply(config, { command, mode }) {
          return mode === 'development'; // запускать плагин только в режиме разработки 
      },

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
        // использования данных конфигурации из "configResolved"
        const columns = config.command === 'serve'

        // если импортируется модуль с расширением .csv
        if (/\.csv$/.test(id)) {
          /* парсинг csv-контента при помощи пакета "csv-parse"
          с добавленим названия колонок как поля в объекта */
          const records = parse(src, { columns });
          return {
            // экпорт данных в виде строки, чтобы их можно было импортировать в другой модуль
            code: `export default ${JSON.stringify(records)}`;
          }
        }
      },

      // Хук для преобразования index.html (параметр html)
      transformIndexHtml(html) {
          console.log(html); // html-код из index.html
          return html.replace('</body>', '<script>alert("transformIndexHtml");</script></body>');
      }
    }
  ]
}
```

Теперь _Vite_ сможет преобразовать CSV-данные:

```csv
id,name,quantity
0,apple,10
```

В валидный ES-модуль и импортировать его в виде объекта/массива:

```javascript
import products from './products.csv';
console.log(products); // [{ "id": "0", "name": "apple", "quantity": "10" }]
```

### Конфигурация плагина

Часто vite-плагины оформляются с помощью функций-фабрик:

```javascript
// vite-plugin-csv.js
export default () => ({
  name: '',
  apply(config, { command, mode }) {},
  resolvedConfig(config) {},
  transform(data, path) {},
  transformIndexHtml(html) {},
})
```

В конфигурации - в массиве `plugins` просто вызываем импортированную функцию-фабрику:

```javascript
// vite.config.js
import Csv from './vite-plugin-csv.js';

export default {
  plugins: [
    Csv()
  ]
}
```

### Существующие Vite-плагины

Официальная страница, посвященная vite-плагинам: [ссылка](https://vitejs.dev/plugins/). _Vite_ основан на сборщике _Roolup_, поэтому большинство rollup-плагинов также подходят для _Vite_: [ссылка](https://vite-rollup-plugins.patak.dev/). Большой список сторонних плагинов: [ссылка](https://github.com/rollup/awesome), [ещё ссылка](https://github.com/vitejs/awesome-vite).

## Конфигурация сервера

Конфигурировать можно как dev-сервер (поле `server`), так и preview-сервер сборки приложения (поле `preview`):

```javascript
// vite.config.js

export default {
  server: {
    // порт dev-сервера
    port: '3000',
    // отключить инкрементацию порта (всегда запускать dev-server на одном и том же порте)
    strictPort: true,
    // адрес запроса при открытии приложения в браузере
    open: '/api/products',
    // заголовки ответа (Response) на запросы
    headers: {
      'X-App-Mode': 'development',
    },
    // проксирование запросов: localhost:8080/products -> dummyjson.com/products
    proxy: {
      '/products': 'https://dummyjson.com',
      // конфигурация proxy в виде объекта
      '/api': {
        // адрес переадресации
        target: 'https://dummyjson.com',
        // изменение заголовка "Origin" на адрес из поля target
        changeOrigin: true,
        // преобразование пути запроса
        rewrite: (path) => path.replace(/\/api/, '')
      }
    },
  },
  preview: { /* аналогичные опции */ }
}
```

## Горячая замена модулей (HMR)

Vite-плагины по-умолчанию, при изменении обрабатываемых ими данных перезагружают страницу целиком. Можно для плагинов подключить _HMR_.

Конфигурация HMR в коде плагина:

```javascript
// vite-plugin-name.js
export default () => ({
  // Хук, включающий горячую перезагрузку (HMR), вызывается при изменении импортируемых модулей
  async handleHotUpdate(context) {
    // если изменен модуль с расширением .csv
    if (/\.csv$/.test(context.file)) {
      // отправляем через web-socket соединение dev-сервера сообщение браузеру
      context.server.ws.send({
        // тип сообщения
        type: 'custom',
        // название события
        event: 'csv-update',
        // считываем сырые данные (read) из обновленного модуля и передаём браузеру новые данные
        data: await context.read()
      });
      // хук возвращает пустой массив - будем сами обрабатывать HMR
      return [];
    }
  },
});
```

Обновленные данные, передаваемые в свойство `data` ws-сообщения необходимо обрабатывать также, как они обрабатываются в хуке "transform". Например, преобразуем CSV-данные в валидный JS-объект. Дополнительно отдаём клиенту в поле `data` путь к обновленному модулю:

```javascript
// vite-plugin-name.js
import { parse } from 'csv-parse/sync';

export default () => ({
  async handleHotUpdate(context) {
    // ...
    context.server.ws.send({
      // ...
      data: {
          // путь к обновленному модулую
          url: context.modules[0].url,
          // обновленные и обработанные (преобразованные) данные модуля
          data: parse(await context.read(), { columns: true })
      }
    });
    // ...
  }
})
```

Обработка HMR на стороне клиента:

```javascript
// main.js

// проверяем, существует ли Vite-объект "hot", отвечающий за горячую замену модулей
if (import.meta.hot) {
    /* прослушиваем событие "csv-update" (указано в конфигурации сообщения)
    url - путь к обновленному модулю
    data - обновленные данные импортируемого модуля, переденные в поле "data" ws-сообщения */
    import.meta.hot.on('csv-update', ({ url, data }) => {
        console.info(`[vite] hot updated: ${url}`);
        document.querySelector('pre').textContent = JSON.stringify(data);
    });
}
```

## Взаимодействие клиента и сервера

C помощью WebSocket соединения с клиентом (браузером), dev-сервер может отправлять ws-сообщения клиенту и слушать сообщения, отправленные клиентом ему в ответ.

### Отправка сообщения из сервера к клиенту

Сервер (плагин):

```javascript
// vite-plugin-name.js

export default () => ({
  // Хук, обработки конфигурации dev-сервера
  // server - данные конфигурации сервера
  configureServer(server) {
    // слушаем событие установки ws-соединения
    server.ws.on('connection', () => {
      // 1 параметр - название события (event)
      // 2 параметр - передаваемые данные (data)
      server.ws.send('connected', 'Connection established');
    });
  },
})
```

Клиент:

```javascript
// main.js

// проверяем, существует ли Vite-объект "hot", отвечающий за горячую замену модулей
if (import.meta.hot) {
    // слушаем событие установки соединения (сообщение от сервера)
    import.meta.hot.on('connected', (message) => {
        console.log(message);
    });
}
```

### Отправка сообщения с клиента на сервер

Клиент:

```javascript
// проверяем, существует ли Vite-объект "hot", отвечающий за горячую замену модулей
if (import.meta.hot) {
    // отправляем сообщение серверу (событие "ping")
    import.meta.hot.send('ping', 'Hello, server!');

    // слушаем ответ сервера на сообщение (вызываемое событие "ping")
    import.meta.hot.on('pong', (message) => {
        console.log(message);
    });
}
```

Сервер:

```javascript
// vite-plugin-name.js

export default () => ({
  configureServer(server) {
    // слушаем событие "ping", отправляемое клиентом
    // message - данные от клиента
    // ws - вебсокет для обратного взаимодействия с клиентом
    server.ws.on('ping', (message, ws) => {
      console.log(message);
      ws.send('pong', 'Hello, client!');
    });
  },
});
```

Vite-объект `import.meta.hot` существует только у dev-сервера. В Production-среде его нет.

## hot.accept()

Предотвратить полную перезагрузку модуля при изменении его данных можно с помощью метода `accept` объекта `import.meta.hot`:

```javascript
// module.js
export default 'Измени эту строку для демонстрации HRM';

if (import.meta.hot) {
  // обработка HMR при обновлении модуля
  import.meta.hot.accept((updatedModuleData) => {
      if (updatedModuleData) { // при ошибке в модуле значением будет undefined
          console.log(updatedModuleData);
      }
  });
}
```

Также можно реализовать обработку HMR для подмодулей:

```javascript
import './submodle.js';

// обработка HMR при обновлении импортируемых модулей
// 1 параметр - массив с адресами модулей, для которых нужен HMR
import.meta.hot.accept(['./submodule.js'], ([subModuleUpdatedData]) => {
  if (subModuleUpdatedData) {
    console.log(subModuleUpdatedData);
  }
});
```


## hot.dispose()

Импортируемые модули могут оставлять после выполнения side-эффекты (побочные эффекты): вывод в консоль, мутация DOM-дерева, изменение данных в LocalStorage и т.п. С помощью метода `hot.dispose` можно отменять побочные эффекты модулей при их горячей замене.
 
Пусть побочным эффектом модуля будет добавление стилей в `index.html`:

```javascript
// module.js

let styles;

const addStylesheet = () => {
    styles = document.createElement('style');
    style.textContent = 'body { background: #000; color: orange }';
    document.head.append(style);
};

// горячая перезагрузка модуля
if (import.meta.hot) {
  import.meta.hot.accept();
}

// добавляем стили в документ
addStylesheet();
```

При каждом изменении стилей, HMR будет добавлять новый тег `<style>` с обновленными стилями в `head` документа. С помощью метода `dispose` объекта `import.meta.hot` можно избавляться от побочных эффектов предыдущего горячего обновления модуля:

```javascript
// module.js

// удаляем стили, присвоенные переменной "styles" в функции "addStylesheet" (пример выше)
const removeStylesheet = () => {
    styles.remove()
};

if (import.meta.hot) {
  // dispose вызывается раньше, чем accept
  import.meta.hot.dispose(() => {
    removeStylesheet();
  })
}
```

## Предустановленные события hot.on()

Помимо кастомных событий для [обмена сообщениями между клиентом и сервером](#взаимодействие-клиента-и-сервера), Vite имеет предустановленные события:

- vite:BeforeUpdate

- vite:AfterUpdate

- vite:BeforeFullReload

- vite:BeforePrune (перед удалением ненужного модуля)

- vite:invalidate (`import.meta.host.invalidate()`)

- vite:error (синтаксическая ошибка в обновляемом модуле)

- vite:ws:disconnect

- vite:ws:connect

Пример использования:

```javascript
// module.js
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', (data) => {
    console.log(data); // объект с данными обновления, ошибки, инвалидации и т.д.
  });
}
```

## Vue-проект

Автоматический способ разворчанивания Vite-проекта:

```bash
bunx create-vite my-vue-app --template vue
```

### Ручной способ

Фреймворк _Vue_ обеспечивает весь Vue-API, Vite-плагин для Vue обеспечивает поддержку файлов с расширением `.vue` (SFC)

```bash
bun i vue @vitejs/plugin-vue
```

Vue-плагин подключаем в `vite.config.js`:

```javascript
import vue from from '@vitejs/plugin-vue';

export default {
  plugins: [vue()]
}
```

Теперь можно разрабатывать Vue-приложение привычным образом:

```html
<!-- index.html -->
<body>
  <div id="app"></div>
  <script type="module" src="/main.js"></script>
</body>
```

```vue
// App.vue
<script setup>
  import { ref } from 'vue';
  const counter = ref(0);
</script>

<template>
  <button @click="() => counter++">Counter: {{ counter }}</button>
</template>
```

```javascript
// /main.js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```
