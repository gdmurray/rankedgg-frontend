import React, {Component} from 'react';
import {SEARCH_USER} from "../../../constants";
import {getRegionQuery, getOpAsset, getAsset} from "../../../functions";
import {Segment, Loader} from "semantic-ui-react";
import "./Search.css";

const axios = require('axios');

class SearchResultItem extends Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            data: props.data
        }
    }

    getAttackerBan = () => {
        const {data} = this.state;
        if(data.attacker == null){
            return (
                <span>No Report Records</span>
            )
        }else{
            return (
                <div>
                    <img src={getOpAsset(data.attacker.logo)} alt="attacker-logo"></img>
                    <span>{data.attacker.name}</span>
                </div>
            )
        }
    }

    getDefenderBan = () => {
        const {data} = this.state;
        if(data.defender == null){
            return (
                <span className="no-report">No Report Records</span>
            )
        }else{
            return (
                <div>
                    <img src={getOpAsset(data.defender.logo)} alt="defender-logo"></img>
                    <span>{data.defender.name}</span>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="search-result-item">
                <div className="search-result-user-info">
                    <div className="pfp">
                        <img src={this.state.data.image} alt="profile"></img>
                    </div>
                    <div className="rank">
                    <img src={getAsset("ranks", this.state.data.current_rank + '.svg')} alt="rank"></img>
                    </div>
                    <div className="username">
                        {this.state.data.username}
                    </div>
                </div>
                <div className="search-result-ban-info">
                    <div>
                        <span>Attacker Ban</span>
                        {this.getAttackerBan()}
                    </div>
                    <div>
                        <span>Defender Ban</span>
                        {this.getDefenderBan()}
                    </div>
                </div>
            </div>
        )
    }
}
export default class SearchResults extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchQuery: null,
            searchResults: null,
            isLoading: true
        }
    }

    componentDidMount(){
        const path = this.props.location.search;
        if(path.length > 2){
            var editedPath = path.replace("?=", '');
            var query = getRegionQuery(true);
            axios.get(SEARCH_USER + "?query="+editedPath+query).then((response) => {
                this.setState({
                    searchQuery: editedPath,
                    searchResults: response.data,
                    isLoading: false
                })
            });
        }
        
    }
    createResults = () => {
        let results = [];
        const {searchResults} = this.state;
        if(searchResults != null){
            var i = 0;
            for(var result of searchResults){
                results.push(<SearchResultItem data={result} key={"result-"+i}/>)
                i++;
            }
        }
        if(results.length === 0){
            return (
                <div>No Results Found</div>
            )
        }else{
            return results;
        }
        
    }
    render(){
        return (
            <div className="search-wrapper">
                <div className="search-results-title">
                <h2>Search Results for: {this.state.searchQuery}</h2>
                </div>
                <Segment>
                    <Loader active={this.state.isLoading}/>
                    <div className="search-results-wrapper">
                        {this.createResults()}
                    </div>
                </Segment>
            </div>
        )
    }
}