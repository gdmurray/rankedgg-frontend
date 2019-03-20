import React, {Component} from 'react';
import {Menu, Button, Input, Card, Image, Icon, Dropdown, Checkbox, Modal, Header, Table} from "semantic-ui-react";
import {FETCH_OPERATORS_URL, TOP_NOTORIOUS_PLAYERS_URL} from "../../constants";
import {getRegionQuery} from "../../functions";

const axios = require('axios');
class OperatorCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        }
    }
    
    render(){
        return (
        <Card onClick={(e) => {this.props.openModalCallback(this.state.data.name)}}color={this.state.data.type == 'attacker' ? 'blue' : 'orange'} className={'operator-card ' + this.state.data.type}>
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

class OperatorModal extends Component{
    openModal = () => this.setState({ showModal: true })

    closeModal = () => {
        this.setState({ showModal: false });
        this.props.closeModalCallback();
    }

    constructor(props){
        super(props);
        this.state = {
            operator: props.operator,
            isLoading: true,
            playerList: null,
            data: {
                "image": null
            },
            showModal: props.showModal
        }
    }

    componentWillReceiveProps(newProps){
        if(newProps.operator !== undefined && newProps.operator !== null){
            console.log("new operator " + newProps.data);
            this.setState({
                showModal: newProps.showModal,
                operator: newProps.operator,
                data: newProps.data
            });
            this.fetchPlayers(newProps.operator);
        }else{
            this.setState({
                showModal: newProps.showModal
            })
        }
    }
    
    fetchPlayers = (operator) => {
        const {useRegion} = this.state;
        var query = "";
        if(useRegion){
            query = getRegionQuery();
        }
        axios.get(TOP_NOTORIOUS_PLAYERS_URL + operator.toLowerCase() + query).then(
            (response) => {
              this.setState({
                playerList: response.data
              })
            }
          )
    }

    componentDidMount(){
        const {operator} = this.state;
        if(operator !== null && operator !== undefined){
            this.fetchPlayers(operator);
        }
    }

    renderTopPlayers(){
        var players = [];

        const { playerList } = this.state;
        if(playerList != null){
            for(var player of playerList){
                players.push(<Table.Row key={player.user_id}>
                    <Table.Cell>
                        {player.username}
                        </Table.Cell>
                        <Table.Cell>{player.reports} {player.reports > 1 ? 'Reports' : 'Report'}</Table.Cell>
                    </Table.Row>
                );
            }
        }

        return players;
    }
    render(){
        const {showModal, operator} = this.state;
        return (
            <Modal open={showModal}
            onOpen={this.openModal}
            onClose={this.closeModal}>
                <Modal.Header>{operator}</Modal.Header>
                <Modal.Content image>
                <Image wrapped size='medium' src={process.env.PUBLIC_URL + '/assets/operators/' + this.state.data.image} />
                <Modal.Description>
                    <Header>Attacker</Header>
                    <Table celled>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell colSpan='2'>Most Notorious {this.state.data.name}s</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderTopPlayers()}
                    </Table.Body>
                    </Table>
                </Modal.Description>
                </Modal.Content>
            </Modal>
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

    fetchOperators = () => {
        const {useRegion} = this.state;
        var query = "";
        if(useRegion){
            query = getRegionQuery();
        }
        console.log("Fetching Operators");
        axios.get(FETCH_OPERATORS_URL + query).then((response) => {
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

            if(order_by == 1){
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
        const {operator_type, order_by, attacker, defender} = this.state;
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
                        <Checkbox onChange={(e,{checked}) => {this.setState({useRegion: checked})}} toggle label='Filter Region'/>
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox onChange={(e,{checked}) => {this.setState({showUnreported: checked})}} toggle label='Show Unreported'/>
                    </Menu.Item>
                    <Menu.Item>
                    <Input onChange={(e, {value}) => {this.setState({searchQuery: value})}}icon='search' placeholder='Search...' />
                    </Menu.Item>
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