import React, { Component } from 'react';
import SubeventRow from './SubeventRow';
class SubeventMetricList extends Component {
    
    
    state = {  }

    componentDidMount(){
        this.setState({
            isLoaded: true
        })   
    }
    render() {
        let settings = this.props.settings;   
        console.log(this.props)
        let subeventMetricData = this.props.subeventMetricData;

        
        
        return ( 
        <div className="subeventList">
            {Object.keys(subeventMetricData).map(num => (
                <SubeventRow 
                    key = {num} 
                    subeventData = {subeventMetricData[num].Metrics}
                    eventName = {subeventMetricData[num].Name}
                    settings = {settings}
                    
                />))}
        </div>);
    }
}
 
export default SubeventMetricList;