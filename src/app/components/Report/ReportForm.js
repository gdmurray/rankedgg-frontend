import React, {Component} from 'react';
import { Form,Grid, Dropdown} from 'semantic-ui-react'
import SelectOperatorDialogue from './SelectOperatorDialogue';
import {OPERATOR_DROPDOWN_URL, SUBMIT_REPORT_USER, REGION_OPTIONS, Attacker, Defender} from '../../../constants';
import {getRegion} from "../../../functions";
import R6TabDisplay from './R6TabDisplay';
const axios = require('axios');

export default class ReportForm extends Component{
    constructor(props){
        super(props);
        this.timeout =  0;
        this.state = {
            regionOptions: REGION_OPTIONS,
            attackerOptions: null,
            defenderOptions: null,
            regionSelected: getRegion(),
            operatorSelected: null,
            isSearching: false,
            isLoading: true,
            usernameError: false,
            operatorTypeSelected: null,
            selectedOperator: null,
            validUser: false,
            usernameQuery: null,
            username: null
        }
    }

    canSubmit = () => {
        var validUser = (this.state.validUser === true);
        var typeSelected = (this.state.operatorTypeSelected != null);
        var opSelected = (this.state.selectedOperator != null);
        if(validUser && typeSelected && opSelected){
            return false
        }else{
            return true
        }
    }
    searchFound = (username) => {
        console.log("search found " + username);
        if(username.toLowerCase() === this.state.usernameQuery.toLowerCase()){
            this.setState({
                isSearching: false,
                validUser: true,
                usernameError: false,
                username: username
            });
        }else{
            console.log("received searchFound for non-active username")
        }
    }

    componentDidUpdate(){
        console.log("Current Confirmed Username: " + this.state.username);
    }
    searchError = (username) => {
        if(!(this.state.usernameQuery === "" || this.state.usernameQuery === undefined)){
            if(username.toLowerCase() === this.state.usernameQuery.toLowerCase()){
                this.setState({
                    usernameError: true,
                    isSearching: false
                });
            }else{
                console.log("received error from different username " + username + " current is " + this.state.username);
            }
        }else{
            this.setState({
                isSearching: false
            });
        }
    }
    scanSearch = (evt) => {
        var searchText = evt.target.value; // this is the search text
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log("Changed username to " + searchText);
            if(searchText !== ""){
                this.setState({
                    usernameError: false,
                    usernameQuery: searchText,
                    validUser: false,
                    isSearching: true
                })
            }
        }, 750);
    }

    canUseDropdown(){
        return (this.state.operatorTypeSelected != null)
    }
    selectedOperatorType = (type) => {
        this.setState({operatorTypeSelected: type});
    }

    handleChange = (e, { value }) => {
        this.setState({
            selectedOperator: value
        })
    };

    handleRegionChange = (e, { value }) => {
        console.log("changed " + value);
        this.setState({
            regionSelected: value
        })
    };
    
    getOperatorOptions = () => {
        if(this.state.operatorTypeSelected === Attacker){
            return this.state.attackerOptions;
        }else if(this.state.operatorTypeSelected === Defender){
            return this.state.defenderOptions;
        }else{
            return null;
        }
    }

    submitForm = () => {
        console.log("submit form?");
        axios.post(SUBMIT_REPORT_USER, {
            username: this.state.username,
            operator: this.state.selectedOperator,
            region: this.state.regionSelected
        }).then((response) => {
            console.log(response);
            this.props.closeCallback();
        }).catch((error)=>{
            console.log(error);
        })
    }
    componentDidMount(){
        axios.get(OPERATOR_DROPDOWN_URL).then((response) => {
            this.setState({
                attackerOptions: response.data.filter(elem => elem.type === Attacker).map(operator => ({ 
                        text: operator.name,
                        value: operator.name.toLowerCase(),
                        image: {avatar: true, src: process.env.PUBLIC_URL + '/assets/operators/' + operator.logo}})),
                defenderOptions: response.data.filter(elem => elem.type === Defender).map(operator => ({ 
                    text: operator.name,
                    value: operator.name.toLowerCase(),
                    image: {avatar: true, src: process.env.PUBLIC_URL + '/assets/operators/' + operator.logo}})),
                isLoading: false
                })

        });
    }
    render(){
        const {usernameQuery} = this.state
        return (
            <Form className="report-username-form">
                <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <h2>Report Toxic Operator</h2>
                        </Grid.Column>
                        <Grid.Column>
                        <Dropdown fluid selection onChange={(e, value) => this.handleRegionChange(e, value)} defaultValue={this.state.regionSelected} options={this.state.regionOptions} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Input error={this.state.usernameError} loading={this.state.isSearching} onChange={(evt) => this.scanSearch(evt)} fluid label='Username' placeholder='Username' />
                        </Grid.Column>
                        <Grid.Column>
                            <R6TabDisplay username={usernameQuery} region={this.state.regionSelected} endSearchCallback={this.searchFound} searchFailedCallback={this.searchError}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <SelectOperatorDialogue selectOperatorCallback={this.selectedOperatorType}/>
                <Dropdown className="select-operator-dropdown" placeholder='Select Operator'
                    loading={this.state.isLoading} clearable options={this.getOperatorOptions()} 
                    disabled={this.state.operatorTypeSelected == null} fluid selection
                    onChange={(e, value) => this.handleChange(e, value)}/>
                <Grid divided="vertically">
                    <Grid.Row columns={2} className="submit-form-row">
                        <Grid.Column>

                        </Grid.Column>
                        <Grid.Column>
                            <Form.Button onClick={() => this.submitForm()} disabled={this.canSubmit()}>Submit</Form.Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        )
    }
}