export const ProductType = `
    type Product {
        id: Int,
        name: String,
        description: String,
        img: String,
        ingredients: [Ingredient]
    }
`;

const dummyData = [{
    id: 0,
    name: 'Baby Shampoo',
    description: '',
    img: null
}, {
    id: 1,
    name: 'Soap',
    description: 'A simple soup with nothing special',
    img: null
}];

export const ProductResolver = () => dummyData;
