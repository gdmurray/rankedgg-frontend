import React, {Component} from 'react';
import {Button, Icon, Label, Grid, Image} from 'semantic-ui-react';

export const Attacker = "attacker";
export const Defender = "defender";
export default class SelectOperatorDialogue extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: null
        }
    }

    selectOperator = (type) => {
        console.log(type);
        this.setState({
            value: type
        });
        this.props.selectOperatorCallback(type);
    }

    attackerSelected = () => {
        if (this.state.value == Attacker){
            return "selected-attacker";
        }
        return '';
    }

    defenderSelected = () => {
        if (this.state.value == Defender){
            return "selected-defender";
        }
        return '';
    }

    render(){
        return (
            <Grid divided="vertically" className="select-operator-dialogue">
                <Grid.Row columns={2}>
                    <Grid.Column className="attacker" onClick={() => this.selectOperator(Attacker)}>
                        <div className="operator-type-wrapper attacker">
                            <img src={process.env.PUBLIC_URL + '/assets/attacker.svg'}/>
                            <h3 className={this.attackerSelected()}>Attacker</h3>
                        </div>
                    </Grid.Column>
                    <Grid.Column className="defender" onClick={() => this.selectOperator(Defender)}>
                        <div className="operator-type-wrapper defender">
                            <img src={process.env.PUBLIC_URL + '/assets/defender.svg'}/>
                            <h3 className={this.defenderSelected()}>Defender</h3>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}