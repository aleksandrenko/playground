import React from 'react';
import {graphql} from "react-apollo/index";

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import Details from './Details';

import Spinner from '../Shared/Spinner';
import getQueryQL from '../../utils/generateQL';

class Index extends React.Component {

    render() {
        const type = this.props.type;
        const { loading, error, refetch } = this.props.data;
        const data = this.props.data[type.name];

        if (loading) {
            return <Spinner label='Loading ...' />
        }

        return (
            <div>
                { error && <div style={{ color: 'red' }}>{ error.message }</div> }

                { !error &&
                    <Details
                        data={data}
                        type={type}
                    />
                }

                <DefaultButton onClick={() => refetch()}>Refresh</DefaultButton>
            </div>
        );
    }
}

export default (type) => {
    return graphql(getQueryQL(type),
    {
        options: (ownProps) => ({
            variables: ownProps.params || {}
        }),
        props: (args) => {
            return {
                ...args,
                type
            }
        }
    }
    )(Index);
};
