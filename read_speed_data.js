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

function parseCSV(inputFile) {
  return new Promise((resolve, reject) => {
    const inputCSVJSON = [];
    fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (data) => inputCSVJSON.push(data))
    .on('end', async () => {
      let transformedData = await transformData(inputCSVJSON);
      data_yep = await outputModifiedCSV(transformedData);
      resolve(data_yep);
      return data_yep;
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
    row.Timestamp = row.Timestamp.replace(/-/g,"/").replace("T"," ").slice(0,-8);
    row.Ping = Math.round(row.Ping);
    row.Download = Math.round(row.Download/1000000);
    row.Upload = Math.round(row.Upload/1000000);
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