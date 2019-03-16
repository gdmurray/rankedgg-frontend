import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import './App.css';
import './components/report.css';
import Home from './pages/Home';
import Navbar from './components/Header/Navbar';
import Footer from './components/Footer';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react'
import TestPage from './pages/Test';
import ReportModal from './components/ReportModal';
import SearchResults from './pages/Search';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showModal: false,
      searchQuery: null,
    }
  }
  
  goHome = () => {
    this.props.history.push('/');
  }
  searchUser = (query) => {
    if(query == null || query == ""){
        // TODO: error handling
    }else{
      this.setState({
        searchQuery: query
      });
      this.props.history.push(`/search?=` + query);
    }
    
  } 

  openModalCallback = () => {
    console.log("modal opened??");
    this.setState({
      showModal: true
    })
  }

  refresh = () => {
    this.forceUpdate();
  }
  closeModalCallback = () => {
    console.log("closing modal from app");
    this.setState({
      showModal: false
    })
  }
  render() {
    const App = () => (
      <div>
        <ReportModal showModal={this.state.showModal} closeModalCallback={this.closeModalCallback}/>
        <Navbar onReportCallback={this.openModalCallback} homeCallback={this.goHome} refreshCallback={this.refresh} searchCallback={this.searchUser}>
        </Navbar>
        <div className="App-content">
          <Switch>
            <Route exact path='/search' component={SearchResults} />}/>
            <Route exact path='/' component={Home}/>
            <Route exact path='/test' component={TestPage}/>
          </Switch>
        </div>
        <Footer/>
      </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default withRouter(App);