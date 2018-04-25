import * as React from 'react';
import { withRouter, NavLink } from 'react-router-dom';


class NavComponent extends React.Component {

    render() {
        const schema = this.props.schema || [];
        const items = schema.queryTypes || [];
        const mutations = schema.mutationTypes || [];

        return (
            <ul className="tabs">
                {
                    items.map(item => {
                        const url = `/${item.name}`;

                        return (
                            <li key={url}>
                                <NavLink
                                    to={url}
                                    activeClassName="activeNav"
                                >
                                    { item.name }
                                </NavLink>
                            </li>
                        )
                    })
                }
                <li>|</li>
                {
                    mutations.map(item => {
                        const url = `/${item.name}`;

                        return (
                            <li key={url}>
                                <NavLink
                                    key={url}
                                    to={url}
                                    activeClassName="activeNav"
                                >
                                    { item.name }
                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }
}

export default withRouter(NavComponent);