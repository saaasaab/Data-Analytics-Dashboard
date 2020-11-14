import React, { Component } from 'react';
import {genSubeventMetricList} from '../genSubeventMetricList.js';
class SubeventRow extends Component {
    state = { isLoaded: false }
    componentDidMount(){
        this.setState({
            isLoaded: true
        })   
    }

    render() { 
        let {isLoaded} = this.state;
        if (isLoaded){
            let obj = this.props.subeventData;
            let eventName = this.props.eventName;
            //let settings = this.props;
            console.log(eventName)
            //genSubeventMetricList(obj,settings)
        }
        return ( 

            
        <div className="subeventRow">
            <span className="SubeventRowLabel">{this.props.eventName}</span>
            <span className="SubeventRowData"> {this.props.subeventData["Number of Registrations"]}</span>
            <span className="SubeventRowData"> {this.props.subeventData["Average Duration"]}</span>
            <span className="SubeventRowData"> {this.props.subeventData["Attendees"]}</span>
        </div> );
    }
}
 
export default SubeventRow;