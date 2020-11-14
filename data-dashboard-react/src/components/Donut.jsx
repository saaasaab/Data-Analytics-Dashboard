import React, { Component } from 'react';
import { donutChart } from '../donutChart.js';


class Donut extends Component {
    state = { isLoaded: false }

    
    componentDidMount(){
        this.setState({
            isLoaded: true
        })   
    }

    render() { 
        let {isLoaded} = this.state;
        if (isLoaded){
            // elementId,label, labels, values 
            let elementId = `donut${this.props.donutIndex}`;
            let donut = this.props.donutData;
            let label = donut.Donut_Flavor;
            let donutObject = donut.Donut_Values;
            let labels = Object.keys(donutObject);
            let values = Object.values(donutObject);

            donutChart(elementId,label, labels, values );
            //console.log(label);
        }


        return <canvas  className="donut" id={`donut${this.props.donutIndex}`} ></canvas>;
    }
}
 
export default Donut;