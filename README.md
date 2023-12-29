# Vite

Создание Vite-проекта:

```bash
bunx create-vite
```

## Структура проекта

`index.html` - главный (root) файл проекта, подключащий JS-модуль:

```html
<script type="module" src="/main.js"></script>
```

В `main.js` используется импорт/экспорт ESModule'ей:

- Стили импортируемых `css`-файлов Vite загружает в HTML;

- Импорт изображений возвращает путь к статическому файлу.

- Импорт из `/public` (например `import img from '/img.jpg'`) vite возвращает в оригинальном непреобразованном виде (статика).

## Vite inspect plugin

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
