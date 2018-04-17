export const IngredientType = `
    type Ingredient {
        id: Int,
        name: String,
        description: String,
        origin: String,
        rating: Int  
    }
`;

const dummyData = [{
    id: 0,
    name: 'Aloe',
    description: 'Nature product',
    origin: 'Nature',
    rating: 5
}, {
    id: 1,
    name: 'Sugar',
    description: 'To much calories',
    img: null,
    origin: 'Nature',
    rating: 3
}];

export const IngredientResolver = () => dummyData;
