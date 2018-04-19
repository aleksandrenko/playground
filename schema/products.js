export const ProductType = `
    type Product {
        id: Int,
        name: String,
        description: String,
        img: String,
        ingredients: [Ingredient]
    }
`;

const dummyData = () => {
    var data = [];

    for(var i = 0; i<100; i++) {
        data.push({
            id: i,
            name: Math.random()*10000,
            description: Math.random()*10000,
            img: null
        });
    }

    return data;
};

export const ProductResolver = () => dummyData()[1];

export const ProductsResolver = dummyData;
