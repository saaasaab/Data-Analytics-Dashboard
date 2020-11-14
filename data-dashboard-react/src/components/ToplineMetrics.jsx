import React, { Component } from 'react';
import Scorecard from './Scorecard';

class TimelineMetrics extends Component {
    scorecards = this.props.toplineMetrics;
    render() { 
        return (
            <React.Fragment>
                <div className="ToplineMetrics">
                    {this.props.toplineMetrics.map(scorecard => (
                    <Scorecard 
                        key = {scorecard[0]}
                        label = {scorecard[0]} 
                        value = {scorecard[1]}
                    />))}
                </div>
            </React.Fragment>  
        );
    }
}
 
export default TimelineMetrics;