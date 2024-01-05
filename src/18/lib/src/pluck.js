import collect from 'collect.js';

export const pluckAndLog = (items, field) => {
    const plucked = collect(items).pluck(field);
    console.log(plucked);
    return plucked;
}
