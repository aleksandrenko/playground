import * as React from 'react';
import { withRouter, NavLink } from 'react-router-dom';


class NavComponent extends React.Component {

    render() {
        const schema = this.props.schema || [];
        const items = schema.queryTypes || [];

        return (
            <ul className="tabs">
                {
                    items.map(item => {
                        const url = `/${item.name}`;

                        return (
                            <NavLink
                                key={url}
                                to={url}
                                activeClassName="activeNav"
                            >
                                { item.name }
                            </NavLink>
                        )
                    })
                }
            </ul>
        );
    }
}

export default withRouter(NavComponent);