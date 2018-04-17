import { makeExecutableSchema } from 'graphql-tools';

import { ProductType, ProductResolver } from './products';
import { IngredientType, IngredientResolver } from './ingredients';

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    products: [Product]
    ingredients: [Ingredient]
  }
  ${ProductType}
  ${IngredientType}
`;

// The resolvers
const resolvers = {
    Query: {
        products: ProductResolver,
        ingredients: IngredientResolver
    },
};

const logger = {
    log: e => console.log(e)
};

// Put together a schema
export default makeExecutableSchema({
    typeDefs,
    resolvers,
    logger
});