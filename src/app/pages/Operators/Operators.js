import React, {Component} from 'react';
import {Menu, Input, Card, Image, Icon, Dropdown, Checkbox} from "semantic-ui-react";
import {FETCH_OPERATORS_URL} from "../../../constants";
import {getRegionQuery} from "../../../functions";
import OperatorModal from "./OperatorModal";
const axios = require('axios');

class OperatorCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        }
    }
    
    componentWillReceiveProps(newProps){
        if(newProps.data){
            this.setState({
                data: newProps.data
            })
        }
    }
    render(){
        return (
        <Card onClick={(e) => {this.props.openModalCallback(this.state.data.name)}}color={this.state.data.type === 'attacker' ? 'blue' : 'orange'} className={'operator-card ' + this.state.data.type}>
            <Image src={process.env.PUBLIC_URL + '/assets/operators/'+this.state.data.image}/>
            <Card.Content>
                <Card.Header><Image className="operator-logo" src={process.env.PUBLIC_URL + '/assets/operators/' + this.state.data.logo}/> {this.state.data.name}</Card.Header>
                <Card.Meta className="operator-meta">{this.state.data.type.capitalize()}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <a>
                    <Icon name='file text' />
                    {this.state.data.report_count} Reports
                </a>
            </Card.Content>
        </Card>
        )
    }
}

export default class Operators extends Component{
    
    constructor(props){
        super(props);
        this.order_by_options = ['Reports', 'Name'];
        this.operator_options = ['All', 'Attacker', 'Defender'];
        this.state = {
            order_by: 0,
            attacker: true,
            defender: true,
            operators: null,
            operatorMap: null,
            useRegion: false,
            showUnreported: false,
            searchQuery: '',
            showModal: false,
            selectedOperator: null
        }
    }

    componentDidMount(){
        this.fetchOperators();
    }

    getLocalRegionQuery = () => {
        var query = "";
        if(this.state.useRegion){
            query = getRegionQuery();
        }
        return query;
    }

    fetchOperators = () => {
        console.log("Fetching Operators from Server");
        axios.get(FETCH_OPERATORS_URL + this.getLocalRegionQuery()).then((response) => {
            this.setState({
                operators: response.data,
                operatorMap: Object.assign({}, ...(response.data.map(item => ({ [item.name]: item }) )))
            })
        })
    }


    getDropdownTitle = () => {
        const {attacker, defender} = this.state;
        if(attacker === true && defender === true){
            return "All Operators"
        }else if(attacker === true){
            return "Attackers"
        }else if(defender === true){
            return "Defenders"
        }else{
            return "All Operators";
        }
    }
    getSelected = () => {
        const {attacker, defender} = this.state;
        if(attacker && !defender){
            return "attacker";
        }else if(!attacker && defender){
            return "defender"
        }
    }
    
    filterRegion = (value) => {
        console.log(value);
        this.setState({
            useRegion: value
        }, () => {this.fetchOperators();});
    }

    openOperatorModal = (operator) => {
        this.setState({
            showModal: true,
            selectedOperator: operator
        })
    }

    closeModalCallback = () =>{
        this.setState({
            showModal: false
        })
    }
    renderOperators = () => {
        // can do filter operations on list;
        var operator_list = [];
        const {operators, attacker, defender, order_by, showUnreported, searchQuery} = this.state;
        if (operators){
            var ops = [...operators];
            if (attacker !== defender){
                ops = ops.filter(op => op.type === this.getSelected());
            }

            if(order_by === 1){
                ops.sort(function(a, b){
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                })
            }

            if(!showUnreported){
                ops = ops.filter(op => op.report_count > 0);
            }

            if(searchQuery !== ''){
                ops = ops.filter(op => op.name.toLowerCase().includes(searchQuery.toLowerCase()) );
            }
            for(var op of ops){
                operator_list.push(<OperatorCard openModalCallback={this.openOperatorModal} key={op.name} data={op}/>)
            }
        }
        return operator_list;
    }
    
    getOperatorData(){
        if(this.state.selectedOperator !== undefined && this.state.operatorMap !== null && this.state.operatorMap !== null){
            return this.state.operatorMap[this.state.selectedOperator];
        }
    }
    render(){
        const {order_by, attacker, defender} = this.state;
        return (
            <div className="page-wrapper">
                <Menu>
                    <OperatorModal showModal={this.state.showModal} closeModalCallback={this.closeModalCallback} operator={this.state.selectedOperator} data={this.getOperatorData()} useRegion={this.state.useRegion}/>
                    <Dropdown item text={this.getDropdownTitle()} closeOnChange={false}>
                        <Dropdown.Menu >
                            <Dropdown.Item active={attacker} onClick={(e) => this.setState({attacker: !attacker})}><Icon hidden={!attacker} color="blue" name="checkmark"/> Attackers</Dropdown.Item>
                            <Dropdown.Item active={defender} onClick={(e) => this.setState({defender: !defender})}><Icon hidden={!defender} color="orange" name="checkmark"/> Defenders</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown item text={"Order By: " + this.order_by_options[order_by]}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => this.setState({order_by: 0})}>Reports</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => this.setState({order_by: 1})}>Name</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item>
                        <Checkbox onChange={(e,{checked}) => {this.filterRegion(checked)}} toggle label='Filter Region'/>
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox onChange={(e,{checked}) => {this.setState({showUnreported: checked})}} toggle label='Show Unreported'/>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Input onChange={(e, {value}) => {this.setState({searchQuery: value})}}icon='search' placeholder='Search...' />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <div className="operators-wrapper">
                    <Card.Group>
                        {this.renderOperators()}
                    </Card.Group>
                </div>
            </div>
        )
    }
}