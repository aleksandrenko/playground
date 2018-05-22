import React, {Component, Fragment} from 'react';
import styles from './styles.css';

import {Dropdown} from 'office-ui-fabric-react/lib/Dropdown';


class Query extends Component {

    render() {
        console.log(this.props.schema);

        return (
            <nma-layout>
                <nma-row>
                    <nma-title>
                        choose properties to include
                    </nma-title>
                    <nma-content>
                        <nma-maker>
                            <nma-line># Type queries into this side of the screen, and you will</nma-line>
                            <nma-line># see intelligent typeaheads aware of the current GraphQL type schema,</nma-line>
                            <nma-line># live syntax, and validation errors highlighted within the text.</nma-line>
                            <nma-line>&nbsp;</nma-line>
                            <nma-line>
                                # We'll get you started with a simple query showing your username!
                            </nma-line>
                            <nma-line>&nbsp;</nma-line>

                            <nma-line data-selected="true">
                                <nma-root>query</nma-root>
                                <nma-ocb/>
                            </nma-line>

                            <nma-group>
                                <nma-line data-selected="true" title="Deselect 'user' property.">
                                    <nma-property>
                                        <nma-check/>
                                        user
                                    </nma-property>
                                    <nma-ob/>
                                    <nma-attribute>login</nma-attribute>
                                    <nma-colon/>
                                    <nma-string>"<input size="3" className="input" type="text" value="tist"/>"
                                    </nma-string>
                                    <nma-comma/>
                                    <nma-attribute>login</nma-attribute>
                                    <nma-colon/>
                                    <nma-string>"<input size="3" className="input" type="text" value="tist"/>"
                                    </nma-string>
                                    <nma-cb/>
                                    <nma-comment>:User</nma-comment>
                                    <nma-ocb/>
                                </nma-line>

                                <nma-group>
                                    <nma-line data-selected="true" title="Description goes here">
                                        <nma-property>
                                            <nma-check/>
                                            id
                                        </nma-property>
                                        <nma-comment>:Int</nma-comment>
                                    </nma-line>

                                    <nma-line title="Select 'name' property.">
                                        <nma-property>
                                            <nma-check/>
                                            name
                                        </nma-property>
                                        <nma-comment>:String</nma-comment>
                                    </nma-line>

                                    <nma-line data-selected="true" title="Deselect 'sex' property.">
                                        <nma-property>
                                            <nma-check/>
                                            sex
                                        </nma-property>
                                        <nma-comment>:Boolean</nma-comment>
                                    </nma-line>

                                    <nma-line title="Select 'location' property.">
                                        <nma-property>
                                            <nma-check/>
                                            location
                                        </nma-property>
                                        <nma-comment>:String</nma-comment>
                                    </nma-line>
                                </nma-group>

                                <nma-line>
                                    <nma-ccb/>
                                </nma-line>

                                <nma-line title="Select 'comments' property.">
                                    <nma-property>
                                        <nma-check/>
                                        comments
                                    </nma-property>
                                    <nma-comment>:[Comment]</nma-comment>
                                </nma-line>

                                <nma-line title="Select 'commits' property.">
                                    <nma-property>
                                        <nma-check/>
                                        commits
                                    </nma-property>
                                    <nma-comment>:[Commit]</nma-comment>
                                </nma-line>

                                <nma-line title="Select 'other' property.">
                                    <nma-property>
                                        <nma-check/>
                                        other
                                    </nma-property>
                                    <nma-comment>:[Other]</nma-comment>
                                </nma-line>
                            </nma-group>

                            <nma-line>
                                <nma-ccb/>
                            </nma-line>
                        </nma-maker>

                    </nma-content>
                </nma-row>

                <nma-row>
                    <nma-title>
                        Generated graphql request
                    </nma-title>
                    <nma-content>
                        code
                    </nma-content>
                </nma-row>

                <nma-row>
                    <nma-title>
                        server responce
                    </nma-title>
                    <nma-content>
                        server responce
                    </nma-content>
                </nma-row>

            </nma-layout>
        )
    }
}

export default Query;