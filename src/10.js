const modules = import.meta.glob('/src/10/*.js', { eager: true });

console.log(modules);

// для асинхронной загрузки модулей (eager: false) по событию "click"
// document.addEventListener('click', () => {
//     Object.values(modules).forEach(async (module) => {
//         const moduleData = await module();
//         console.log(moduleData);
//     });
// });