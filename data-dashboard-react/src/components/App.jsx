import React, { Component } from 'react';
import ToplineAndHeatmap from './ToplineAndHeatmap'
import NavBar from './NavBar'
import DonutGroup from './DonutGroup';
import SubeventMetricList from './SubeventMetricList';
import json_data from '../small.json';
import settings from '../settings.json';
import { dataBlender } from '../dataBlender.js';




class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            obj: [],
            isLoaded: false,
            isOnOverview: true
        }
    }
    showMap = true;
    row = [1,2,3,4,5];

    async componentDidMount(){
        //Process the json
        let obj = await dataBlender(json_data,settings)
        // Separate the json into the component pieces
       
        this.setState({
            isLoaded: true,
            obj: obj, 
        })   
    }

    render() { 
        let {isLoaded, obj, isOnOverview} = this.state;

        let metrics = [];
        let donutData= [];
        let subeventMetricData = [];

        if (isOnOverview && isLoaded){
            let metricList = Object.keys(obj["Overview_Page"]["Metrics"]);
            console.log(metricList)
            for(let key of metricList){
                metrics.push([key,obj["Overview_Page"]["Metrics"][key]]);
            }
            
            donutData = obj["Overview_Page"]["Donut_Charts"];
            subeventMetricData=obj["Subevents"]

        }
        else if(!isOnOverview && isLoaded){
            let eventIndex = 0;
            let metricList = Object.keys(obj["Subevent"][eventIndex]["Metrics"]);
            console.log(metricList)
            for(let key of metricList){
                metrics.push([key,obj["Subevent"][eventIndex]["Metrics"][key]]);
            }
            donutData = obj["Subevents"][eventIndex]["Donut_Charts"];
        }



        if(!isLoaded){
            return <div>LOADING...</div>;
        }

        else{
            return (  
            <React.Fragment>
                <NavBar clientName = {obj["Overview_Page"]["Event"]}/>
                <ToplineAndHeatmap toplineMetrics = {metrics} showMap={this.showMap}/>
                <DonutGroup donutData = {donutData}/>
                <SubeventMetricList subeventMetricData = {subeventMetricData} settings = {settings}/>
                
            </React.Fragment>
            );
        }
    }
}


 
export default App;