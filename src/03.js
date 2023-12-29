// автоматически добавляет css в HTML
import './assets/03.css';
// ручное добавление css в HTML
import cssData from './assets/03.css?inline';
const styleEl = document.createElement('style');
styleEl.innerText = cssData;
document.querySelector('head').append(styleEl);