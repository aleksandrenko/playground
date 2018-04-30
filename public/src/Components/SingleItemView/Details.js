import React from 'react';

const getTypeAndDataFromEntity = (entity) => {
    const key = Object.keys(entity);
    const entityValues = entity[key];
    const data = {};
    const type = {
        type: {
            fields: []
        }
    };

    for (let key in entityValues) {
        // results from the request will have auto field: __typename
        if (key === '__typename') {
            break;
        }

        type.type.fields.push({
            name: key
        });

        data[key] = entityValues[key];
    }

    return {
        type,
        data
    }
};

class Details extends React.Component {

    render() {
        const entity = this.props.entity;
        const { type, data } = entity // type is the schema and the data is the key: value format result from the apollo client
            ? getTypeAndDataFromEntity(entity) // server result data format is in one single object
            : this.props;

        const uiFields = (type && data) &&
            type.type.fields
                .map(field => {
                    return (data &&
                        <div className="row" key={`field_${field.name}`}>
                            <label className="label" title={ field.description }>{ field.name }:</label>
                            <span className="value">{data[field.name]}</span>
                        </div>
                    )
                });

        return (
            <div className="field">
                { uiFields }
            </div>
        );
    }
}

export default Details;