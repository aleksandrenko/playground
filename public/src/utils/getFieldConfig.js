export default (field) =>
    field.description
        .toLowerCase()
        .split('@')
        .map(part => part.trim())
        .splice(1)
        .concat([field.type.toLowerCase()])
        .reduce((sum, annotation) => {
            const parts = annotation.replace(')', '').split('(');
            const key = parts[0];
            const value = parts[1] || true;
            sum[key] = value;

            return sum;
        }, {})