import { makeExecutableSchema } from 'graphql-tools';

import { ProductType, ProductsResolver, ProductResolver, createProduct} from './products';
import { IngredientType, IngredientResolver } from './ingredients';

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    products(idLargerThen: Int): [Product]
    product(id: Int!, name: String): Product
    ingredients: [Ingredient]
  }
  
  type Mutation {
    createProduct (
        # Client's name @min(10) @max(100)
        name: String, 
        
        # @email
        email: String, 
        
        color: AllowedColor 
        
        inStock: Boolean
        
        # A short description @min(10) @max(255)
        description: String
    ): Product
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