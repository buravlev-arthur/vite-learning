import './assets/03.css';
import cssData from './assets/03.css?inline';

console.log(cssData);
const styleEl = document.createElement('style');
styleEl.innerText = cssData;
document.querySelector('head').append(styleEl);