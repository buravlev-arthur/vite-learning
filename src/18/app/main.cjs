const { pluck } = require('pluck');
const { log } = require('pluck/log');

const users = [
    { name: 'John', age: 30 },
    { name: 'Adam', age: 26 },
    { name: 'Smith', age: 44 },
];

log(pluck(users, 'name'));
