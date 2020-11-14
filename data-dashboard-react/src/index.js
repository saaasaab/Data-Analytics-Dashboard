import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './globalcss.css';
import reportWebVitals from './reportWebVitals';
import App from './components/App'


ReactDOM.render( 
    <App/>
, document.getElementById('root') );

// let ToplineAndHeatmapLayout=document.getElementById('ToplineAndHeatmap')
// showMap? ToplineAndHeatmapLayout.style.gridTemplateColumns = "1fr 1fr 1fr":
//             ToplineAndHeatmapLayout.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";  

reportWebVitals();
