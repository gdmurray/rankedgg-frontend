import React, {Component} from 'react';
import {SEARCH_USER} from "../../constants"
const axios = require('axios');

export default class SearchResults extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchQuery: null
        }
    }

    componentDidMount(){
        const path = this.props.location.search;
        if(path.length > 2){
            var editedPath = path.replace("?=", '');
            

            axios.get(SEARCH_USER + "?query="+editedPath).then((response) => {
                console.log(response);
            });

            this.setState({
                searchQuery: editedPath
            })

        }
        
    }
    render(){
        return (
            <div>
                Search Results: {this.state.searchQuery}
            </div>
        )
    }
}