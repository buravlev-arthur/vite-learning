const { pluckAndLog } = require('@buravlev-arthur/pluck');
const { log } = require('@buravlev-arthur/pluck/log');

const users = [
    { name: 'John', age: 30 },
    { name: 'Adam', age: 26 },
    { name: 'Smith', age: 44 },
];

pluckAndLog(users, 'name');