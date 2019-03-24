import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import ReportModal from './components/Report/ReportModal';
import SearchResults from './components/Search/Search';
import Operators from './pages/Operators/Operators';
import Leaderboard from './pages/Leaderboard';

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
    if(query === null || query === ""){
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

  routeCallback = (route) => {
    this.props.history.push(route);
  }
  render() {
    const App = () => (
      <div className="App-body">
        <ReportModal showModal={this.state.showModal} closeModalCallback={this.closeModalCallback}/>
        <Navbar routeCallback={this.routeCallback} onReportCallback={this.openModalCallback} homeCallback={this.goHome} refreshCallback={this.refresh} searchCallback={this.searchUser}>
        </Navbar>
        <div className="App-content">
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/search' component={SearchResults}/>
            <Route exact path="/operators" component={Operators}/>
            <Route exact path="/leaderboard" component={Leaderboard}/>
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