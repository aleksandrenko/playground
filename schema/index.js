import { makeExecutableSchema } from 'graphql-tools';

import { ProductType, ProductsResolver, ProductResolver, createProduct} from './products';
import { IngredientType, IngredientResolver } from './ingredients';

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    products(isPublic: Boolean): [Product]
    product(id: Int!, name: String): Product
    ingredients: [Ingredient]
  }
  
  type Mutation {
    createProduct (name: String, email: String, description: String): Product
  }
  
  ${ProductType}
  ${IngredientType}
`;

// The resolvers
const resolvers = {
    Query: {
        products: ProductsResolver,
        product: ProductResolver,
        ingredients: IngredientResolver
    },
    Mutation: {
        createProduct: createProduct
    }
};

const logger = {
    log: e => console.log('logger', e)
};

// Put together a schema
export default makeExecutableSchema({
    typeDefs,
    resolvers,
    logger
});