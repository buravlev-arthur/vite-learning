import { template } from './12.jsx';

console.log(template.outerHTML);

document.querySelector('#app').appendChild(template);