import React, { Component } from 'react';
import Donut from './Donut';
class DonutGroup extends Component {
    state = {  }
    render() { 

        return (  
            <div className="donuts">
                <Donut donutData = {this.props.donutData[0]} donutIndex = {0}/>
                <Donut donutData = {this.props.donutData[1]} donutIndex = {1}/>
            </div>
        );
    }
}
 
export default DonutGroup;