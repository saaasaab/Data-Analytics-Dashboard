export async function dataBlender(json_data,settings){

    const json_data_duration = await addDurations(json_data);
    const updated_json_data =await removeVersion(json_data_duration);
    const event_list = await getEvents(updated_json_data);
    const headers = await getHeaders(updated_json_data, event_list);
    //const allMetrics = await allHeaders(headers);
    const subeventMetrics = await getSubeventMetrics(updated_json_data, event_list, headers); //Ready for Export
    //console.log(subeventMetrics);
    const subeventNums = await subeventMetricsNums(subeventMetrics,event_list); //Ready for Export
    //console.log(subeventMetrics);
    const overviewData = await getOverviewMetrics(updated_json_data);
    //console.log(overviewData);
    const timelineData = await timelineDate(updated_json_data, event_list);
    const JSONExport = await createJSONExport(overviewData,subeventNums,subeventMetrics,updated_json_data, timelineData, settings);
    return JSONExport
}



Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


// async function catchData(file) {
//   const response = await fetch(file);
//   const data = await response.json();
//   return data
// }

async function addDurations(json_data){ // In Minutes
  // let event_list = []
  for (let i = 0; i < json_data.length; i++){
    json_data[i]['Session Start'] = new Date(json_data[i]['Session Start']);
    json_data[i]['Session End'] = new Date(json_data[i]['Session End']);

    json_data[i]["Duration"] = (json_data[i]['Session End'] - json_data[i]['Session Start'])/60000;
  }
  return json_data
}

async function getEvents(json_data){

  let event_list = []
  for (let i = 0; i < json_data.length; i++){

    let reg = json_data[i];
    if(!event_list.includes(reg['event'])){
      event_list.push(reg['event']);
    }
  }
  return event_list 
}


async function getHeaders(json_data, event_list){
  let header_lists = {}
  for (let i = 0; i < event_list.length; i++){ 
    let header_list = [];
    for (let j = 0; j < json_data.length; j++){
      let reg = json_data[j];
      let header_keys = Object.keys(reg);
      for (let k = 0; k < header_keys.length; k++){

        if (event_list[i] === reg['event']  && !header_list.includes(header_keys[k])){
          header_list.push(header_keys[k]);
        }
      }
    }
    //console.log(header_list);
    header_lists[event_list[i]] = header_list;
  }
  return header_lists
}

async function removeVersion(data){

  for (let row of data){
    row["Browser"]=row["Browser"].replace(/\.|[0-9]/g, '');
    row["Device Type"]=row["Device Type"].replace(/\.|[0-9]/g, '');
  }
  return data

}


/*
What I Want from this function is to create an object with the headers 
as the keys, and the unique value arrays for each.
*/
async function getSubeventMetrics(json_data, event_list, headers){
  // if !device in list of devices, add it to the object and increment by one
  // if device in list of devices, then increment one to the id
  let allMetrics = {}
  for (let i = 0; i < Object.keys(headers).length; i++){ 
    // Object.keys(headers)[i] is the event name
    // Create a empty dictionary for this event 

    let event_name = Object.keys(headers)[i];
    let event_heads = headers[event_name];
    let dict = {}
    
    for (let h = 0; h < event_heads.length; h++){
      dict[event_heads[h]] = {}
    }

    //Cycle through every data point and if the event is correct, add to each list
    //console.log(Object.keys(headers));
    // Each event will have different headers

    // let unique_list = [];
    for (let j = 0; j < json_data.length; j++){
      let reg = json_data[j];
      if (reg['event']===event_name){
        //Reg is a dictionary
        //console.log(Object.keys(reg).length);
        for(let m = 0; m < Object.keys(reg).length; m++){
          // Dict[ List of Dict [nth element]]
          //pull the list from the dict for this event for this metric
          //console.log()
          
          if(!(reg[Object.keys(reg)[m]] in dict[Object.keys(reg)[m]]) ){
            dict[Object.keys(reg)[m]][reg[Object.keys(reg)[m]]] = 1;
          }
          else{
            dict[Object.keys(reg)[m]][reg[Object.keys(reg)[m]]]++;
          }
        }
      }
    }
    allMetrics[event_name]=dict
  }
  return allMetrics
}

// async function allHeaders(headers){
//   let h = [] 
//   for(let k = 0; k < Object.keys(headers).length; k++){
//     for(let m = 0; m < Object.keys(headers[Object.keys(headers)[k]]).length; m++){
//       if(!h.includes(headers[Object.keys(headers)[k]][m])){
//         h.push(headers[Object.keys(headers)[k]][m]);
//       }
//     }
//   }
//   return h;
// }



async function subeventMetricsNums(subeventMetrics,event_list){
  let allMetrics ={}
  for(let k = 0; k < event_list.length; k++){
    let event = event_list[k];
    let metrics = {}
    for (let m = 0; m < Object.keys(subeventMetrics[event]).length; m++){
      metrics[Object.keys(subeventMetrics[event])[m]] = Object.size(subeventMetrics[event][Object.keys(subeventMetrics[event])[m]]);
    }
    allMetrics[event]=metrics
  }
  return allMetrics
}



async function getOverviewMetrics(json_data){
  let uniqueKeys = Object.keys(Object.assign({}, ...json_data));
  let metrics={}
  for (let m = 0; m < Object.keys(uniqueKeys).length; m++){
    let metric = uniqueKeys[m];
    var uniqueValues = json_data.map( (value) => value[metric]).filter( (value, index, _arr) => _arr.indexOf(value) === index);
    metrics[metric]=uniqueValues.length
  }
  return metrics
}


async function createJSONExport(overviewData,subeventNums,subeventMetrics,json_data,timelineData,settings){

  let exportJSON = {
    "Client_Logo":"",
    "Overview_Page":{
      "Event":"", 
      "Metrics":{},
      // "Donut_Charts":[
      //   {
      //     "Donut_Flavor":"",
      //     "Donut_Values":{}
      //   },
      // ],
    },
    "Subevents":[ 
    ]
  };

  exportJSON["Overview_Page"]["Event"] = "Crowdstreet"; 
  exportJSON["Overview_Page"]["Metrics"] = overviewData;
  exportJSON["Overview_Page"]["Metrics"]["Number of Registrations"]=json_data.length;
  // let count = 0;

  let browsers = [];
  let deviceTypes = [];
  for (let event in subeventNums){

    browsers.push(subeventMetrics[event]["Browser"]);
    deviceTypes.push(subeventMetrics[event]["Device Type"]);

    let durAndAtt = getAverageDuration(event,json_data);
    let metrics = subeventNums[event];
    let tables = subeventMetrics[event];
    let donuts = getDonuts(subeventMetrics[event]);
    let durations = getDurationRanges(subeventMetrics[event]["Duration"]); 
    let timeline = timelineData[event];
    tables["Duration"] = durations;
    metrics["Number of Registrations"]=getRegistrationNum(event,json_data);
    metrics["Average Duration"]=durAndAtt[0];
    metrics["Attendees"]=durAndAtt[1]
    exportJSON["Subevents"].push(
      {
        "Name": event,
        "Event_Start":"BROADCAST_START",
        "Event_END":"BROADCAST_END",
        "Metrics":metrics,
        "Donut_Charts":donuts,
        "Comments":getComments(event,json_data),
        "Tables":tables,
        "Timeline":timeline
      }); 
    //console.log(subeventMetrics[event])
   }

   //console.log(subeventMetrics[event]);s

   let finalDict = {}
   finalDict["Browser"] = getMetricDonutDict(browsers,"Browser",settings)["Browser"];
   finalDict["Device Type"] = getMetricDonutDict(deviceTypes,"Device Type",settings)["Device Type"];
   exportJSON["Overview_Page"]["Donut_Charts"] = getDonuts(finalDict);

  //console.log(uniqueKeys(browsers) , uniqueKeys(deviceTypes));

  return exportJSON
}


function getMetricDonutDict(data,metric,settings){
  //console.log(data)
  let finalDict = {};
  finalDict[metric]={};
  for (let key of uniqueKeys(data)){
    let keyCount = 0;
    for (let dict of data){
      if(Object.keys(dict).includes(key)){
        if(Object.keys(finalDict[metric]).includes(key)){
            finalDict[metric][key]+=data[keyCount][key];
        }
        else{
          let n = data[keyCount][key];
          finalDict[metric][key] = n;
        }
      }
      keyCount++;
    }
  }

  //With the dict filled out, only take the top 6 and put the rest in "OTHER"

  let donutLabelLimit = settings["Donut Limit"];

  if(Object.size(finalDict[metric])>donutLabelLimit){
    let other = 0;
    let values = Object.values(finalDict[metric]);
    let sortValues = values.sort(function(a, b) {
      return a - b;
    }).reverse();
    for (let key of Object.keys(finalDict[metric])) {
      if (finalDict[metric][key]<sortValues[donutLabelLimit-1]){
        other += parseInt(finalDict[metric][key]);
        delete finalDict[metric][key];
      }
    }
    finalDict[metric]["Other"] = other;


  }
  return finalDict
}
function uniqueKeys(data){
  var uniqueKeys = Object.keys(data.reduce(function(result, obj) {
    return Object.assign(result, obj);
  }, {}))

  return uniqueKeys
} 


function getDonuts(data){
  
    let donuts = []
    let labels = ["Browser", "Device Type"]
    for (let i = 0; i < 2; i++){
      let donut = {};
      donut["Donut_Flavor"] = labels[i];
      donut["Donut_Values"] = data[labels[i]];
      donuts.push(donut);
    } 
    return donuts
}



function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}



function getComments(event,json_data){
  let comments = [];
  for (let i in json_data){
    let reg = json_data[i];
    if (Object.keys(reg).includes('Comments')){
      if (reg["Comments"] !== "undefined" && reg["event"] === event){
        comments.push(reg["Comments"]);
      }
    }
  }
  return comments
}


function getRegistrationNum(event,json_data){
  let registrationNum = 0;
  for (let i in json_data){
    let reg = json_data[i];
    if (reg['event']===event){
      registrationNum ++;
    }
  }
  return registrationNum;
}


function getAverageDuration(event,json_data){
  let durationSum = 0;
  let attendCount = 0;
  for (let i in json_data){
    let reg = json_data[i];
    if (reg['event']===event && reg['Duration'] > 0){
      durationSum+=reg['Duration'];
      attendCount++;
    }
  }
  //console.log(durationSum/attendCount,attendCount);
  return [Math.round(durationSum/attendCount),attendCount];
}
function getDurationRanges(durations){
  let durs = Object.keys(durations).map(Number);

  const numRanges = 10;
  const maxDur = Math.max(...durs);
  const minDur = Math.min(...durs);
  const rangeInterval = Math.ceil((maxDur-minDur)/numRanges);

  let rangesLabels = [];
  let rangesValues = [];

  for (let i = 0; i < numRanges; i++){
    let upperRange = (i+1)*rangeInterval;
    let lowerRange = i*rangeInterval+1;
    rangesLabels.push(`${lowerRange} - ${upperRange}`)
    rangesValues.push([lowerRange,upperRange])
  }
  
  let binifiedDurations = {};
  for (let range of rangesLabels){
    binifiedDurations[range] = 0;
  }
  binifiedDurations[0]=0;

  
  
  for( let dur of durs){
    for (let r in rangesValues){
      if (dur >= rangesValues[r][0] && dur <= rangesValues[r][1]){
        binifiedDurations[rangesLabels[r]] += durations[dur];
      }
    }
    if (dur === 0){
      binifiedDurations[0] += durations[dur];
    }
  }
  
  return binifiedDurations;
  //console.log(ranges)
  //***
}



async function timelineDate(json_data, event_list){
  let allTimeData={}

  //Separates the json_data into each subevent

  let timeline = {}
  for (let i in json_data){
    let reg = json_data[i];
    if (!Object.keys(allTimeData).includes(reg['event'])){
      allTimeData[reg['event']]=[];
    }
    allTimeData[reg['event']].push([reg["Session Start"],reg["Session End"]])
  }



  // Finds the min and max times for each event
  for (let event of event_list){  
    let startDates = [];
    let endDates = [];
    for (let t of allTimeData[event]){
      startDates.push(t[0]);
      endDates.push(t[1]);
    }

    let min = endDates.reduce(function (a, b) { return a < b ? a : b; }); 
    let max = startDates.reduce(function (a, b) { return a > b ? a : b; });


    let numIntervals = 100;
    let intervalSize = (max - min)/numIntervals/60000;
    let intervals = [];
    for(let i = 0; i < numIntervals+1; i++){
      intervals.push(addMinutes(min, i*intervalSize));
    }

    let attended = []
    let eventTimeline = []
    for(let i = 0; i < intervals.length; i++){

      //intervals.push(addMinutes(min, i*intervalSize));
      attended.push([]);
      for (let t of allTimeData[event]){
        if (t[0] >= intervals[i] && t[1] <= intervals[i+1]){
          attended[i].push(1);
        }
        else{
          attended[i].push(0);
        }
      }


      let totalAttended = attended[i].reduce((a, b) => a + b, 0);
      //console.log(totalAttended)
      eventTimeline.push({x: intervals[i].getTime()/1000, y: totalAttended})
      
    }
    timeline[event] = eventTimeline

    
    // console.log(min);
    // console.log(intervals);
    // console.log(max);
    // console.log(" ");
  } 
  //console.log(allTimeData)
  return timeline;
}