import React, {Component} from 'react';
import {Modal} from 'semantic-ui-react';
import ReportForm from './ReportForm';

export default class ReportModal extends Component{
    constructor(props){
        super(props);
        this.state={
            showModal: props.showModal
        }
    }
    
    openModal = () => this.setState({ showModal: true })

    closeModal = () => {
        this.setState({ showModal: false });
        this.props.closeModalCallback();
    }

    componentWillReceiveProps(newProps){
        console.log(newProps);
        this.setState({
            showModal: newProps.showModal
        });
    }

    render(){
        const {
            showModal
          } = this.state
        return (
            <Modal
          open={showModal}
          onOpen={this.openModal}
          onClose={this.closeModal}
          size='large'>
          <Modal.Content>
            <ReportForm closeCallback={this.closeModal}/>
          </Modal.Content>
        </Modal>
        )
    }
}