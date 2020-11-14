export function genSubeventMetricList(obj,settings){
    let subeventNamesAll=[];
    let subeventMetricNamesAll = [];
    let subeventValuesAll = [];

    for(let s of obj["Subevents"]){
      subeventNamesAll.push(s["Name"]);
      //console.log(s);
      for (let key of Object.keys(s["Metrics"])){
        if(!subeventMetricNamesAll.includes(key)){
          subeventMetricNamesAll.push(key);
        }
      }
    }

    for(let s of obj["Subevents"]){
      let value_array=[]
      for(let mn of subeventMetricNamesAll){
        value_array.push(s["Metrics"][mn])
      }
      subeventValuesAll.push(value_array);
    }


    let subeventNames=subeventNamesAll//[];
    let subeventMetricNames = []//subeventMetricNamesAll;//[];
    let subeventValues = []//subeventValuesAll//[];

    let index_metrics = settings["Subevent Header"];//[2,3,9,8];

    for (let sv of subeventValuesAll){
      let value_array=[]
      for(let i of index_metrics){
        if(!subeventMetricNames.includes(subeventMetricNamesAll[i])){

          subeventMetricNames.push(subeventMetricNamesAll[i]);

        }
        if(sv[i] == null){
          value_array.push(0);
        }
        else{
          value_array.push(sv[i]);
        }
        
      }
      subeventValues.push(value_array);
    }

    //bannedSubevents = settings["Banned Subevents"];

    return subeventValues;
}