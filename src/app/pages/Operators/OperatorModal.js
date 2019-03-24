import React, {Component} from 'react';
import {Table, Modal, Image, Header} from 'semantic-ui-react';
import {TOP_NOTORIOUS_PLAYERS_URL} from "../../../constants";
import {getRegionQuery} from "../../../functions";
const axios = require('axios');

export default class OperatorModal extends Component{
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
        const {useRegion} = this.props;
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
                <Modal.Description className="operator-modal-content">
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