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

const getSimplifyField = (_field) => ({
    name: _field.name,
    type: getType(_field),
    isRequired: getIsRequired(_field),
    description: _field.description
});

const isList = (queryType) => queryType.type.constructor.name === 'GraphQLList';
const isEnum = (queryType) => queryType.constructor.name === 'GraphQLEnumType';


const getTypeDefinitionFromGraphQLTypes = (types, typeToFind) => types
    .find(_type => _type.name === (typeToFind.type.name || typeToFind.type.ofType.name));


/**
 * A simple js transformation from graphql schema to simpler object for easier handling
 * @param fields
 * @returns {{queryTypes: Array, mutationTypes: Array, types: Array}}
 */

export default (fields) => {

    console.log('GraphQL Schema', fields);

    const enums =  Object.values(fields._typeMap)
        .filter(isEnum)
        .filter(_enum => _enum.astNode)
        .map(_enum => ({
            [_enum.name]: (_enum.astNode.values.map(val => val.name.value))
        }));

    /**
     * Simplifying schema types
     * @type {{name: *, description: *, fields: {name: *, type: *, isRequired: *, description: *}[]}[]}
     */
    const schemaTypes = Object.values(fields._typeMap)
        .filter(field => field.astNode !== undefined)
        .filter(field => field.name !== 'Query')
        .filter(field => !isEnum(field))
        .map(schemaField => {

            return {
                name: schemaField.name,
                description: schemaField.description,
                fields: Object.values(schemaField._fields)
                    .map(getSimplifyField)
            }
        });

    /**
     * Simplifying schema query types
     * @type {{name: string, isList: *, type: *, arguments: {name: *, type: *, isRequired: *, description: *}[]}[]}
     */
    const queryTypes = Object.values(fields._queryType._fields)
        .map(queryType => ({
                name: queryType.name,
                isList: isList(queryType),
                type: getTypeDefinitionFromGraphQLTypes(schemaTypes, queryType),
                arguments: queryType.args
                    .map(getSimplifyField)
            })
        );

    /**
     * Simplifying schema mutations
     * @type {{name: string, returnType: *, arguments: {name: *, type: *, isRequired: *, description: *}[]}[]}
     */
    const mutationTypes = Object.values(fields._mutationType._fields)
        .map(mutationType => ({
                name: mutationType.name,
                returnType: getTypeDefinitionFromGraphQLTypes(schemaTypes, mutationType),
                arguments: mutationType.args.map(getSimplifyField)
            })
        );

    console.log('Simplified schema');
    console.log('Enums:', enums);
    console.log('Query Types:', queryTypes);
    console.log('Mutation Types:', mutationTypes);
    console.log('Schema Types:', schemaTypes);
    console.log('');

    return {
        enums,
        queryTypes,
        mutationTypes,
        schemaTypes
    };
}