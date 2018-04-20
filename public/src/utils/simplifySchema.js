const getType = (field) => {
    let type = field.type.name;

    if (field.type.constructor.name === 'GraphQLList') {
        type = 'List';
    }

    if (field.type.constructor.name === 'GraphQLNonNull' && field.type.ofType) {
        type = field.type.ofType.name;
    }

    return type;
};

const getIsRequired = (field) => field.type.constructor.name === 'GraphQLNonNull';

export default (fields) => {

    const schema = {
        queryTypes: [],
        types: []
    };

    console.log('raw data', fields);

    schema.types = Object.values(fields._typeMap)
        .filter(field => field.astNode !== undefined)
        .filter(field => field.name !== 'Query')
        .map(field => ({
            name: field.name,
            description: field.description,
            fields: Object.values(field._fields)
                .map(_field => ({
                    name: _field.name,
                    type: getType(_field),
                    isRequired: getIsRequired(_field),
                    description: _field.description
                }))
        }));

    schema.queryTypes = Object.values(fields._queryType._fields)
        .map(queryType => {
            const field = {
                name: queryType.name,
                isList: queryType.type.constructor.name === 'GraphQLList',
                type: schema.types.find(_type => {
                    return _type.name === (queryType.type.name || queryType.type.ofType.name);
                })
            };

            return field;
        });

    console.log('simplified schema', schema);

    return schema;
}