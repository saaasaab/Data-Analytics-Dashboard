import Chart from "chart.js";

export function donutChart(elementId,label, labels, values){    
    let canvas = document.getElementById(elementId);
            // var myCanvas = document.getElementById(elementId);
    canvas.width = 900;
    canvas.height = 450;
    new Chart(canvas, {
        type: 'doughnut',
        data: {
        labels: labels,
        datasets: [
            {
            label: label,
            backgroundColor: ["#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd"],

            data: values,
            }
        ]
        },
        options: {
        defaultFontFamily: Chart.defaults.global.defaultFontFamily = 'Lato',
        responsive: false,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: label,
            fontSize:30,
            fontColor:"#d2d2d2",
            position: "bottom"
        },
        legend: {
            position: 'left',
            labels: {
                    fontColor: "#d2d2d2",
                    fontSize: 12
                }
            //fontColor:"#d2d2d2",
        },

        }
    });   
}