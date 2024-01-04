export const pluck = (collection, field) => {
    return collection.map((item) => item[field]);
}
