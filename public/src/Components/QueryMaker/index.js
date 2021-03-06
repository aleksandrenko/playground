import React, {Component, Fragment} from 'react';
import styles from './styles.css';

import {DefaultButton} from 'office-ui-fabric-react/lib/Button';

const ROOT_TYPES = {
  QUERY: 'Query',
  MUTATION: 'Mutation'
};

const initialState = {
    rootType: ROOT_TYPES.QUERY
};

const getArguments = (type) => {
    console.log('type', type);

    const returnType = (
        <nma-comment>
            :
            { type.isList && '[' }
            { type.type ? type.type.name : type.returnType.type }
            { type.isList && ']' }
        </nma-comment>
    );

    if (type.arguments.length) {
        return (
            <Fragment>
                <nma-ob/>
                {
                    type.arguments.map(arg => {
                        return (
                            <Fragment>
                                <nma-attribute>{ arg.name }</nma-attribute>
                                <nma-colon/>
                                <nma-string>
                                    "<input size="3" className="input" type="text" value=""/>"
                                </nma-string>
                            </Fragment>
                        );
                    })
                }
                <nma-cb/>
                { returnType }
            </Fragment>
        );
    } else {
        return <Fragment>{ returnType }</Fragment>;
    }
};

const getRootChildrenToDisplay = (type, schema) => {
    if (!schema || !type) {
        return null;
    }

    const entities = (type === ROOT_TYPES.QUERY)
        ? schema.queryTypes
        : schema.mutationTypes;

    return entities.map(type => (
        <nma-line data-selected="false" key={ type.name }>
            <nma-property>
                <nma-check/>
                { type.name }
            </nma-property>
            { getArguments(type, schema) }
        </nma-line>
    ));
};

class Query extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    rootChange = (rootType) => {
        this.setState({
            rootType
        });
    };

    render() {

        return (
            <nma-layout>
                <nma-row>
                    <nma-title>
                        choose properties to include
                    </nma-title>

                    <npm-subhead>
                        <DefaultButton
                            onClick={this.rootChange.bind(this, ROOT_TYPES.QUERY)}
                            primary={this.state.rootType === ROOT_TYPES.QUERY}>
                            {ROOT_TYPES.QUERY}
                        </DefaultButton>
                        <DefaultButton
                            onClick={this.rootChange.bind(this, ROOT_TYPES.MUTATION)}
                            primary={this.state.rootType === ROOT_TYPES.MUTATION}>
                            {ROOT_TYPES.MUTATION}
                        </DefaultButton>
                        <nma-hint>(choose the type of your request)</nma-hint>
                    </npm-subhead>

                    <nma-content>
                        <nma-maker>
                            <nma-line data-selected="true">
                                <nma-root>{this.state.rootType}</nma-root>
                                <nma-ocb/>
                            </nma-line>

                            <nma-group>
                                { getRootChildrenToDisplay(this.state.rootType, this.props.schema) }

                                {/*<nma-line data-selected="true" title="Deselect 'user' property.">*/}
                                    {/*<nma-property>*/}
                                        {/*<nma-check/>*/}
                                        {/*user*/}
                                    {/*</nma-property>*/}
                                    {/*<nma-ob/>*/}
                                    {/*<nma-attribute>login</nma-attribute>*/}
                                    {/*<nma-colon/>*/}
                                    {/*<nma-string>"<input size="3" className="input" type="text" value="tist"/>"*/}
                                    {/*</nma-string>*/}
                                    {/*<nma-comma/>*/}
                                    {/*<nma-attribute>login</nma-attribute>*/}
                                    {/*<nma-colon/>*/}
                                    {/*<nma-string>"<input size="3" className="input" type="text" value="tist"/>"*/}
                                    {/*</nma-string>*/}
                                    {/*<nma-cb/>*/}
                                    {/*<nma-comment>:User</nma-comment>*/}
                                    {/*<nma-ocb/>*/}
                                {/*</nma-line>*/}

                                {/*<nma-group>*/}
                                    {/*<nma-line data-selected="true" title="Description goes here">*/}
                                        {/*<nma-property>*/}
                                            {/*<nma-check/>*/}
                                            {/*id*/}
                                        {/*</nma-property>*/}
                                        {/*<nma-comment>:Int</nma-comment>*/}
                                    {/*</nma-line>*/}

                                    {/*<nma-line title="Select 'name' property.">*/}
                                        {/*<nma-property>*/}
                                            {/*<nma-check/>*/}
                                            {/*name*/}
                                        {/*</nma-property>*/}
                                        {/*<nma-comment>:String</nma-comment>*/}
                                    {/*</nma-line>*/}

                                    {/*<nma-line data-selected="true" title="Deselect 'sex' property.">*/}
                                        {/*<nma-property>*/}
                                            {/*<nma-check/>*/}
                                            {/*sex*/}
                                        {/*</nma-property>*/}
                                        {/*<nma-comment>:Boolean</nma-comment>*/}
                                    {/*</nma-line>*/}

                                    {/*<nma-line title="Select 'location' property.">*/}
                                        {/*<nma-property>*/}
                                            {/*<nma-check/>*/}
                                            {/*location*/}
                                        {/*</nma-property>*/}
                                        {/*<nma-comment>:String</nma-comment>*/}
                                    {/*</nma-line>*/}
                                {/*</nma-group>*/}

                                {/*<nma-line>*/}
                                    {/*<nma-ccb/>*/}
                                {/*</nma-line>*/}

                                {/*<nma-line title="Select 'comments' property.">*/}
                                    {/*<nma-property>*/}
                                        {/*<nma-check/>*/}
                                        {/*comments*/}
                                    {/*</nma-property>*/}
                                    {/*<nma-comment>:[Comment]</nma-comment>*/}
                                {/*</nma-line>*/}

                                {/*<nma-line title="Select 'commits' property.">*/}
                                    {/*<nma-property>*/}
                                        {/*<nma-check/>*/}
                                        {/*commits*/}
                                    {/*</nma-property>*/}
                                    {/*<nma-comment>:[Commit]</nma-comment>*/}
                                {/*</nma-line>*/}

                                {/*<nma-line title="Select 'other' property.">*/}
                                    {/*<nma-property>*/}
                                        {/*<nma-check/>*/}
                                        {/*other*/}
                                    {/*</nma-property>*/}
                                    {/*<nma-comment>:[Other]</nma-comment>*/}
                                {/*</nma-line>*/}
                            </nma-group>

                            <nma-line>
                                <nma-ccb/>
                            </nma-line>
                        </nma-maker>

                    </nma-content>
                </nma-row>

                <nma-row>
                    <nma-title>
                        generated graphql request
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
                        {/*{ JSON.stringify(this.props.schema) }*/}
                    </nma-content>
                </nma-row>

            </nma-layout>
        )
    }
}

export default Query;