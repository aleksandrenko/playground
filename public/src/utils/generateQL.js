import gql from "graphql-tag";

export default (type) => {
    //TODO these two can be extracted and used in multiple places

    const queryName = type.name;
    const props = type.type.fields
        .map(field => {
            let string = field.name;

            if (field.type === 'List') {
                string += `{ id }`;
            }

            return string;
        })
        .join('\n');

    const varDefinitions = type.arguments
        .reduce((acc, arg, index, args) => {
            if (index === 0) {
                acc += '(';
            }

            const isRequiredString = arg.isRequired ? '!' : '';
            acc += `$${arg.name}: ${arg.type}${isRequiredString}`;

            if (index+1 === args.length) {
                acc += ')';
            } else {
                acc += ', ';
            }

            return acc;
        }, '');

    const vars = type.arguments
        .reduce((acc, arg, index, args) => {
            if (index === 0) {
                acc += '(';
            }

            acc += `${arg.name}: $${arg.name}`;

            if (index+1 === args.length) {
                acc += ')';
            } else {
                acc += ', ';
            }

            return acc;
        }, '');

    const qlString = `
              query ${queryName}Query${varDefinitions} {
                ${queryName}${vars} {
                  ${ props }
                }
              }
            `;

    console.log('gql', qlString);

    return gql`
        ${qlString}
    `;
};