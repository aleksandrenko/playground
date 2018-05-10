/*
    GraphQL basic types:

    Int: A signed 32‐bit integer.
    Float: A signed double-precision floating-point value.
    String: A UTF‐8 character sequence.
    Boolean: true or false.
    ID: The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache.
        The ID type is serialized in the same way as a String; however, defining it as an ID signifies that it is not
        intended to be human‐readable.

    Custom types:

    @Date
        @Format(mm:dd:yyyy)
        @Future: The date is valid only if in the future
        @FutureOrPresent: The date is valid only if in the future or present
        @Past: The date is valid only if in the past
        @PastOrPresent: The date is valid only if in the past or present

    @Email: A text field with email validation

    @File: Will show a browse UI element
    @URL: A field validation url string

    Additional validation:
        @Precision(10): Cam ne use for float types, specifies the digits after the decimal sign

        @Positive: Can be used for int and float
        @PositiveOrZero: Can be used for int and float
        @Negative: Can be used for int and float
        @negativeOrZero: Can be used for int and float

        @Min(1): Can be used for email, url, string, number, float
        @Max(10): Can be used for email, url, string, number, float

    Custom Behavior:
        @Default(516): The ui element for this field will use this as initial value

        @NoUserInput: Will not show the field as readonly in the UI
        @NoUI: Will not render any ui for the field
*/

export const ProductType = `
    enum AllowedColor {
      RED
      GREEN
      BLUE
    }

    type Product {
        id: Int!
        name: String!
        email: String
        isPublic: Boolean
        description: String
        img: String
        creatingDate: String
        color: AllowedColor 
        ingredients: [Ingredient]
    }
    
    input ProductInput {
        # @NoUserInput 
        id: Int!
        
        # @Min(3) @Max(20)
        name: String!
        
        # @Min(3) @Max(20) @Email
        email: String
        
        # @Default(true)
        isPublic: Boolean
        
        # Description of the product
        description: String
        
        # Photo of the product @File
        img: String
        
        # Date of Creation @Date
        creatingDate: String
    }
`;

const dummyData = () => {
    var data = [];

    for(var i = 0; i<90; i++) {
        data.push({
            id: i,
            name: Math.random()*10000,
            description: Math.random()*10000,
            img: null,
            isPublic: (Math.random() > 0.5),
            creatingDate: new Date()
        });
    }

    return data;
};

let createdProducts = dummyData();

export const ProductResolver = (_, { id, name }) => {
    return createdProducts.find(product => {
        return product.id === id;
    });
};

export const createProduct = (_, params) => {
    console.log('_', params);
    const id = createdProducts.length+1;

    createdProducts.unshift({
        id: createdProducts.length+1,
        name: params.name,
        email: params.email,
        description: params.description || '',
        img: null,
        isPublic: true,
        creatingDate: new Date()
    });

    return createdProducts.find(product => {
        return product.id === id;
    });
};

export const ProductsResolver = (_, { idLargerThen, isPublic }) => {
    console.log('idLargerThen', idLargerThen);

    if (idLargerThen === undefined) {
        return createdProducts;
    }

    let filteredProducts = createdProducts.filter(product => product.id > idLargerThen);

    if (isPublic !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.isPublic === isPublic);
    }

    return filteredProducts;
};
