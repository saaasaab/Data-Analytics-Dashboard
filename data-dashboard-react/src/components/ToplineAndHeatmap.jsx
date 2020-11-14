import React, { Component } from 'react';
import ToplineMetrics from './ToplineMetrics';
import Heatmap        from './Heatmap';

class ToplineAndHeatmap extends Component {
    
    render() { 
        return (
        <div className="ToplineAndHeatmap">
           <ToplineMetrics toplineMetrics = {this.props.toplineMetrics}/>
           {this.props.showMap?<Heatmap/>:""}
        </div>
        )
    }
}
 
export default ToplineAndHeatmap
;