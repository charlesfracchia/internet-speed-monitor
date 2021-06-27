const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const csv = require('csv-parser');
const fs = require('fs');

const csvStringifier = createCsvStringifier({
  header: [
      {id: 'Timestamp', title: 'Time'},
      {id: 'Ping', title: 'Ping'},
      {id: 'Download', title: 'Download'},
      {id: 'Upload', title: 'Upload'},
  ]
});

function parseCSV(inputFile, getRaw=false) {
  return new Promise((resolve, reject) => {
    
    let parse_errors = 0;
    let transformedData = [];
    const inputCSVJSON = [];

    fs.createReadStream(inputFile)
    .pipe(csv())
    .on('error', function (err) {
      console.log("Detected error: " + err.message)
    })
    .on('data', async (data) => {
      if ((data['Server ID'].indexOf('ERROR') != -1) || (data['Server ID'].indexOf('Cannot retrieve') != -1)){
        parse_errors = parse_errors + 1
      }else{
        inputCSVJSON.push(data)
        let transformedRow = await transformRow(data)
        transformedData.push(transformedRow)
      }
    })
    .on('end', async () => {
      console.log("--- Found "+parse_errors.toLocaleString('en')+" errors in the CSV log")
      if (getRaw) {
        resolve(inputCSVJSON);
        return inputCSVJSON;
      }else{
        completed_data = await outputModifiedCSV(transformedData);
        resolve(completed_data);
        return completed_data;
      }
      
    });
  })
}

function transformData(inputCSVtoTransform){
  return new Promise((resolve, reject) => {
    // console.log(inputCSVtoTransform);
    inputCSVtoTransform.forEach(transformRow);
    resolve(inputCSVtoTransform);
  });
}

function transformRow(row) {
  return new Promise((resolve, reject) => {
    try {
      row.Timestamp = row.Timestamp.replace(/-/g,"/").replace("T"," ").slice(0,-8);
      row.Ping = Math.round(row.Ping);
      row.Download = Math.round(row.Download/1000000);
      row.Upload = Math.round(row.Upload/1000000);
    } catch (error) {
      console.log(row)
    }
    // row.Distance = row.Distance; //for conversion TODO
    // console.log("---");
    resolve(row);
  });
}

function outputModifiedCSV(modifiedCSVJSON) {
  return new Promise((resolve, reject) => {
    resolve(csvStringifier.getHeaderString()+csvStringifier.stringifyRecords(modifiedCSVJSON));
  });
}

module.exports = {
  parseCSV
}