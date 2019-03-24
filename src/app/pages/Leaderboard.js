import React, {Component} from 'react';
import {Menu, Checkbox, Input, Table, Header, Image, Dropdown, Loader, Pagination} from 'semantic-ui-react';
import {SEARCH_WEBSOCKET_URL, PLAYER_LEADERBOARD_URL, RANK_MAP, Attacker, Defender} from "../../constants"
import {getRegionQuery, getOpAsset} from "../../functions";

import "../components/Search/Search.css";
const axios = require('axios');

export default class Leaderboard extends Component{
    constructor(props){
        super(props);
        this.navigateFunction = this.navigateFunction.bind(this);
        this.pageOptions = [10, 25, 50, 100]
        this.state ={
            searchQuery: '',
            useRegion: false,
            playerList: [],
            page: 1,
            pageSize: 25,
            pages: 0,
            nextPage: null,
            previousPage: null,
            isLoading: true
        }
    }

    handlePagination = (data) => {
        var newPage = data.activePage;
        const {page, nextPage, previousPage, pageSize} = this.state;
        if( (newPage - page) === 1 ){
            this.fetchPlayers(nextPage, newPage);
        }else if( (newPage - page) === -1){
            this.fetchPlayers(previousPage, newPage);
        }else{
            var link = PLAYER_LEADERBOARD_URL + "?page=" + newPage + "&page_size=" + pageSize;
            this.fetchPlayers(link, newPage);
        }
    }

    fetchPlayers(link = false, activePage = 1){
        if(!(link)){
            var pageQuery = "?page_size=" + this.state.pageSize;
            link = PLAYER_LEADERBOARD_URL + pageQuery + this.getLocalRegionQuery(true);
        }else{
            link = link + this.getLocalRegionQuery(true);
        }
        axios.get(link).then((response) => {
            const {count, next, previous, results} = response.data;
            const {pageSize} = this.state;
            var pages = Math.floor(count/pageSize);
            this.setState({
                page: activePage,
                pages: pages,
                nextPage: next,
                previousPage: previous, 
                playerList: results,
                isLoading: false
            })
        })
    }
    navigateFunction(event){
        const {page, nextPage, previousPage} = this.state;
        if(event.keyCode === 37) {
            if(previousPage){
                var pg = page - 1;
                this.fetchPlayers(previousPage, pg);
            }
        }else if(event.keyCode === 39){
            if(nextPage){
                var pg = page + 1;
                this.fetchPlayers(nextPage, pg);
            }
        }
      }
      
    componentDidMount(){
        document.addEventListener("keydown", this.navigateFunction, false);
        this.connectSocket(SEARCH_WEBSOCKET_URL);
        this.fetchPlayers();
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.navigateFunction, false);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.pageSize !== this.state.pageSize){
            this.fetchPlayers();
        }
    }
    getLocalRegionQuery = (addition = false) => {
        var query = "";
        if(this.state.useRegion){
            query = getRegionQuery(addition);
        }
        return query;
    }

    filterRegion = (value) => {
        this.setState({
            useRegion: value
        }, () => {this.fetchPlayers();});
    }

    connectSocket(path) {
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log("Websocket open");
        }
        this.socketRef.onmessage = (e) => {
            if(e.type ===  "message"){
                this.updatePlayer(e.data);
            }
        }
    }
    updatePlayer = (data) => {
        const {playerList} = this.state;
        var newPlayerList = [...playerList], changed = false;
        var i = 0;
        while(i < newPlayerList.length && changed === false){
            if (data.id === newPlayerList[i].id){
                newPlayerList[i] = data;
                changed = true;
            }
            i++;
        }
        if(changed){
            this.setState({
                playerList: newPlayerList
            });
        }
    }

    getPlayers = () => {
        const {playerList} = this.state;
        var players = [];
        var i = 1;
        if(playerList){
            var player_list = [...playerList];
            if(this.state.searchQuery !== ''){
                player_list = player_list.filter(player => player.username.toLowerCase().includes(this.state.searchQuery));
            }
            for(var player of player_list){
                players.push(
                    <PlayerRow data={player} key={player.id} ranking={i}></PlayerRow>
                )
                i++;
            }
            return players;
        }
        return (<div>No Results Found</div>)
    }
    pageMenu = () => {
        return(
            <Dropdown.Menu >
                {this.pageOptions.map(page => {
                    return <Dropdown.Item onClick={(e) => this.setState({pageSize: page})} active={this.state.pageSize === page} key={page+"-pages"}>{page}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        )
    }
    render(){
        return(
            <div>
                <Menu>
                    <Menu.Item>
                        <h2>Leaderboard</h2>
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox onChange={(e,{checked}) => {this.filterRegion(checked)}} toggle label='Filter Region'/>
                    </Menu.Item>
                    <Dropdown item text={"Page Size: " + this.state.pageSize}>
                        {this.pageMenu()}
                    </Dropdown>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Input onChange={(e, {value}) => {this.setState({searchQuery: value})}}icon='search' placeholder='Search Players' />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <div className="leaderboard-wrapper">
                    <Table celled stackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Ranking</Table.HeaderCell>
                                <Table.HeaderCell>Player</Table.HeaderCell>
                                <Table.HeaderCell>Operator Info</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.getPlayers( ) }
                        </Table.Body>
                        <Table.Footer hidden={!(this.state.pages > 0)}>
                            <Table.Row>
                                <Table.HeaderCell colSpan={3}>
                                    <Pagination
                                        activePage={this.state.page}
                                        className="table-pagination"
                                        siblingRange={2} 
                                        totalPages={this.state.pages + 1} 
                                        onPageChange={(event, data) => {this.handlePagination(data)}}/>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <Loader active={this.state.isLoading}/>
                </div>
            </div>
        )
    }
}

class PlayerRow extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        }
    }

    getBan = (type) => {
        const {data} = this.state;
        if(data[type]){
            return (
                <div>
                    <Header as='h3' image>
                        <Image src={getOpAsset(data[type].logo)} rounded size='mini' />
                        <Header.Content>
                        {data[type].name}
                        </Header.Content>
                    </Header>
                </div>
            )
        }
        return(
            <div className="not-found">No {type.capitalize()} Bans</div>
        )
    }
    componentWillReceiveProps(newProps){
        this.setState({
            data: newProps.data
        });
    }
    render(){
        const {data} = this.state;
        return(
            <Table.Row className="leaderboard-row">
                <Table.Cell collapsing className="ranking"> 
                    {this.props.ranking}
                </Table.Cell>
                <Table.Cell className="user-info">
                    <Header as='h4' image>
                        <Image src={data.image} rounded size='mini' />
                        <Header.Content>
                        {data.username}
                        <Header.Subheader>{RANK_MAP[data.current_rank]}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell className="ban-info">
                    <div>
                        <Header className="attacker" as='h5'>Attacker Ban</Header>
                        {this.getBan(Attacker)}
                    </div>
                    <div>
                        <Header className="defender" as='h5'>Defender Ban</Header>
                        {this.getBan(Defender)}
                    </div>
                </Table.Cell>
            </Table.Row>
        )
    }
}