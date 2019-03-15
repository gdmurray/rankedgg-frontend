import React, { Component } from 'react';
import {Grid} from 'semantic-ui-react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div className="App">
        Friendly Scontent Home page
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
            
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
          </Grid.Row>
        </Grid>
    </div>
    );
  }
}
export default Home;