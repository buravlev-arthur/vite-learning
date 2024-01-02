const modules = import.meta.glob('/src/10/*.js', { as: 'raw', eager: true });
const urls = import.meta.glob('/src/10/*.js', { as: 'url', eager: true });
const names = import.meta.glob('/src/10/*.js', { import: 'name', eager: true });
const defaults = import.meta.glob('/src/10/*.js', { import: 'default', eager: true });

console.log(modules);
console.log(urls);
console.log(names);
console.log(defaults);