import React, {Component} from 'react';
import {
    Container,
    Grid,
    Header,
    List,
    Segment,
  } from 'semantic-ui-react';

export default class Footer extends Component{
    render(){
        return (
        <Segment inverted vertical style={{ padding: '3em 0em' }} className="footer">
        <Container>
            <Grid divided inverted stackable>
            <Grid.Row>
                <Grid.Column width={3}>
                <Header inverted as='h4' content='About' />
                <List link inverted>
                    <List.Item as='a'>About</List.Item>
                    <List.Item as='a'>Contact Us</List.Item>
                </List>
                </Grid.Column>
                <Grid.Column width={9}>
                <Header as='h4' inverted>
                    Requests and Thoughts
                </Header>
                <p>
                    Have any requests, ideas, or suggestions? Feel free to shoot me an email at yaboigotsnacks@gmail.com
                </p>
                </Grid.Column>
            </Grid.Row>
            </Grid>
        </Container>
        </Segment>
        )
    }
}