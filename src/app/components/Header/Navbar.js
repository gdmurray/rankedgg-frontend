import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {REGION_OPTIONS, REGION_TEXT_MAP, REGION_VALUE_MAP} from "../../../constants";
import {getRegion, setRegion} from "../../../functions";
import {
  Button,
  Container,
  Input,
  Menu,
  Responsive,
  Segment,
  Visibility,
  Dropdown,
  Icon,
} from 'semantic-ui-react'

const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
  }



export default class Navbar extends Component {
    constructor(props){
        super(props);
        this.state ={
          region: getRegion(),
          searchQuery: null,
        }
    }

    search = () => {

    }
    changeRegion = (e) => {
      var text = e.currentTarget.innerHTML;
      var value = REGION_VALUE_MAP[text];
      setRegion(value);
      this.setState({
        region: value,
      });
    }
    
    handleChange = (e) => {
      this.setState({
        searchQuery: e.currentTarget.value
      });
    }
    enterPressed = (event) => {
      var code = event.keyCode || event.which;
      if(code === 13) {
        this.props.searchCallback(this.state.searchQuery);
      } 
    }

    search = () => {
      const {searchQuery} = this.state;
      this.props.searchCallback(searchQuery);
    }
    render(){
        return (
            <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{padding: '0em 0em' }}
            vertical
          >
            <Menu
            className="upper-menu-container"
              /*fixed={fixed ? 'top' : null}*/
              inverted={true}
              pointing={true}
              size='large'
            >
              <Container>
                <Menu.Item className="header-logo-container" onClick={() => this.props.homeCallback()}>
                    <img className="header-logo" src={process.env.PUBLIC_URL + '/img/logo.png'}></img>
                </Menu.Item>
                <Menu.Item className="upper-header-item">
                    <h4 className="logo-title-main">National Ranked Agency</h4>
                    <h6 className="logo-title-undercard">Keeping our Elo Safe</h6>
                </Menu.Item>
                <Menu.Item position="right" className="search-player">
                  <Input onKeyPress={this.enterPressed.bind(this)} onChange={(e) => this.handleChange(e)} icon={<Icon onClick={this.search}name='search' circular link />} placeholder='Search...' />
                </Menu.Item>
              </Container>
            </Menu>
            <Menu 
            className="lower-menu-container"
            /*fixed={fixed ? 'top' : null}*/
            secondary={true}>
                <Container>
                <Menu.Item>
                    <Dropdown item text={REGION_TEXT_MAP[this.state.region]} >
                        <Dropdown.Menu>
                            <Dropdown.Item value="GLOBAL" onClick={(e) => this.changeRegion(e)}>Global</Dropdown.Item>
                            <Dropdown.Item value="NA" onClick={(e) => this.changeRegion(e)}>America</Dropdown.Item>
                            <Dropdown.Item value="EU" onClick={(e) => this.changeRegion(e)}>Europe</Dropdown.Item>
                            <Dropdown.Item value="AS" onClick={(e) => this.changeRegion(e)}>Asia</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item as='a'>Stats</Menu.Item>
                <Menu.Item as='a'>Most Wanted</Menu.Item>
                <Menu.Item position='right'>
                  <Button secondary className="home-report-button" onClick={() => this.props.onReportCallback()}>
                    Report Player
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
        </Visibility>
      </Responsive>
        )
    }
}