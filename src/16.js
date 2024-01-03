// все переменные окружения
const envVars = import.meta.env;
console.log(envVars);

const isDev = envVars.DEV && envVars.MODE === 'development';
const isProd = envVars.PROD && envVars.MODE === 'production';

console.log(isDev, isProd);