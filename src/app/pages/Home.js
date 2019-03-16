import React, { Component } from 'react';
import {Grid, Table, Icon} from 'semantic-ui-react';
import styled from 'styled-components'
import {TOP_REPORTED_OPERATOR_URL, TOP_NOTORIOUS_PLAYERS_URL} from "../../constants";
import {getRegionQuery} from "../../functions";
const axios = require('axios');
//import { Link } from 'react-router-dom';
/*
              <AttackerBackground src={process.env.PUBLIC_URL + "/img/bluesmoke.png"}/>
                <DefenderBackground src={process.env.PUBLIC_URL + "/img/orangesmoke.png"}/>
*/
const AttackerBackground = styled.img`
width: 100%;
height: auto;
position: absolute;
left: 30px;
top: 230px;
/* opacity: 0.8; */
z-index: 999;
`

const DefenderBackground = styled.img`
position: absolute;
right: 30px;
top: 200px;
z-index: 999;
width: 100%;
height: auto;
`

const AttackerImage = styled.img`
width: 350px;
`

const DefenderImage = styled.img`
width: 350px;
`
class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      top_data: null,
      atkList: null,
      defList: null
    }
  }

  componentDidMount(){
    axios.get(TOP_REPORTED_OPERATOR_URL + getRegionQuery()).then((response) => {
      this.setState({
        top_data: response.data
      })

      if(response.data.attacker){
        axios.get(TOP_NOTORIOUS_PLAYERS_URL + response.data.attacker.operator.name + getRegionQuery()).then(
          (atkResponse) => {
            this.setState({
              atkList: atkResponse.data
            })
          }
        )
      }

      if(response.data.defender){
        axios.get(TOP_NOTORIOUS_PLAYERS_URL + response.data.defender.operator.name + getRegionQuery()).then(
          (defResponse) => {
            this.setState({
              defList: defResponse.data
            })
          }
        )
      }
    })
  }
  getTopAtkPlayers = () =>{
    var players = [];

    const { atkList } = this.state;

    if(atkList != null){
      for(var atk of atkList){
        players.push(
        <Table.Row key={"atk-"+atk.user_id}>
            <Table.Cell>
              {atk.username}
            </Table.Cell>
            <Table.Cell>{atk.reports} {atk.reports > 1 ? 'Reports' : 'Report'}</Table.Cell>
          </Table.Row>
        )
      }
    }
    return players;
    /*
    */
  }
  getTopDefPlayers = () =>{
    var players = [];

    const { defList } = this.state;

    if(defList != null){
      for(var def of defList){
        players.push(
        <Table.Row key={"def-"+def.user_id}>
            <Table.Cell>
              {def.username}
            </Table.Cell>
            <Table.Cell>{def.reports} {def.reports > 1 ? 'Reports' : 'Report'}</Table.Cell>
          </Table.Row>
        )
      }
    }
    return players;
    /*
    */
  }

  renderAttacker = () => {
    const {top_data} = this.state;
    if(top_data){
      if(top_data.attacker){
        return (
            <div>
              <AttackerImage src={process.env.PUBLIC_URL + "/assets/operators/"+top_data.attacker.operator.image}/>
              <span>{top_data.attacker.operator.name}</span>
              <img src={process.env.PUBLIC_URL + "/img/bluesmoke.png"} className="smoke-image" />
              <Table celled className="ranking-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan='2'>Most Notorious {top_data.attacker.operator.name}s</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.getTopAtkPlayers()}
                  </Table.Body>
                </Table>
            </div>
        )
      }else{
        return (
          <div>
            <span className="no-data">No Attacker Data</span>
              <img src={process.env.PUBLIC_URL + "/img/bluesmoke.png"} className="smoke-image" />
          </div>
        )
      }
    }
  }

  renderDefender = () => {
    const {top_data} = this.state;
    if(top_data){
      if(top_data.defender){
        return (
            <div>
                <DefenderImage src={process.env.PUBLIC_URL + "/assets/operators/"+top_data.defender.operator.image}/>
                <span>{top_data.defender.operator.name}</span>
                <img src={process.env.PUBLIC_URL + "/img/orangesmoke.png"} className="smoke-image" />
                <Table celled striped className="ranking-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan='2'>Most Notorious {top_data.defender.operator.name}s</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.getTopDefPlayers()}
                  </Table.Body>
                </Table>
            </div>
        )
      }else{
        return (
          <div>
            <span className="no-data">No Defender Data</span>
              <img src={process.env.PUBLIC_URL + "/img/orangesmoke.png"} className="smoke-image" />
          </div>
        )
      }
    }
  }
  render() {
    return (
    <div className="App">
        <Grid divided="vertically" className="home-wrapper">
          <Grid.Row columns={2}>
            <Grid.Column>
                <h3>Top Reported Attackers</h3>
                {this.renderAttacker()}
            </Grid.Column>
            <Grid.Column>
                <h3>Top Reported Defenders</h3>
                {this.renderDefender()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
    </div>
    );
  }
}
export default Home;