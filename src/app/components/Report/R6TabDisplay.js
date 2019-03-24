import React, {Component} from 'react';
import {Dimmer, Loader, Popup, Icon} from 'semantic-ui-react';
import {SEARCH_R6TAB_USERNAME_URL, REGION_TEXT_MAP} from '../../../constants';
import {getAsset} from '../../../functions';

const axios = require('axios');
export default class R6TabDisplay extends Component{

    constructor(props){
        super(props);
        this.state={
            username: props.username,
            isSearching: false,
            isFound: false,
            data: {
                rank: null,
                image: null
            },
            newSearch: false,
        }
    }
    
    componentWillReceiveProps(newProps){
        if(newProps.username !== this.props.username){
            this.setState({
                username: newProps.username,
                newSearch: true,
                isSearching: true
            });
        }else{
            this.setState({
                newSearch: false
            })
        }
    }

    componentDidUpdate(){
        if(this.state.username !== undefined && this.state.newSearch === true){
            if(this.props.region !== "GLOBAL"){
                var query = "?region="+this.props.region
            }else{
                query = "";
            }
            console.log("query " + query);
            const {username} = this.state;
            axios.get(SEARCH_R6TAB_USERNAME_URL + this.state.username + query).then((response) => {
                this.setState({
                    lastSearched: this.state.username,
                    username: response.data.username,
                    data: {
                        rank: response.data.current_rank,
                        image: response.data.image
                    },
                    isSearching: false,
                    isFound: true
                });
                this.props.endSearchCallback(username);
            }).catch((error) => {
                console.log(error);
                console.log(this.state.newSearch);
                this.setState({isSearching: false, isFound: false});
                this.props.searchFailedCallback(username);
            })
        }
    }
    render(){
        const {isSearching, isFound, username} = this.state;
        if(isSearching === true){
            return (
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            )
        }else if(isFound === false && username !== undefined){
            return (
                <div className="no-results">No results for {this.state.username}</div>
            )
        }else if(isFound === true){
            return (
                <div className="r6-tab-wrapper">
                    <div className="pfp">
                        <img src={this.state.data.image} alt="profile"></img>
                    </div>
                    <div className="rank">
                        <img src={getAsset("ranks", this.state.data.rank + '.svg')} alt="rank"></img>
                    </div>
                    <div className="username">
                        <span>{this.state.username}</span>
                        <Popup trigger={<Icon circular name='question' />}>
                            Only showing results for selected region: <b>{REGION_TEXT_MAP[this.props.region]}</b>
                        </Popup>
                    </div>
                </div>
            )
        }else{
            return (
                <div></div>
            )
        }
        
    }
}