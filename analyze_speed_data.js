function uniqueIPs(ipColumnData) {
  return new Promise((resolve, reject) => {
    ips = [];
    ipColumnData.forEach(element => {
      if (!ips.includes(element['IP Address'])) {
        ips.push(element['IP Address'])
      }
    });
    resolve(ips);
  });
}

function annualAverage(rawData, returnFullData = false) {
  return new Promise((resolve, reject) => {
    downloadData = {};
    uploadData = {};
    pingData = {};
    distanceData = {};

    downloadAvg = {};
    uploadAvg = {};
    pingAvg = {};
    distanceAvg = {};

    sumDownload = 0;
    sumUpload = 0;
    sumPing = 0;
    sumDistance = 0;
    totalElements = 0;

    rawData.forEach(element => {
      totalElements = totalElements + 1
      if (Object.keys(downloadData).includes(element.Timestamp.slice(0,4))) {
        downloadData[element.Timestamp.slice(0,4)].push(element.Download)
        downloadAvg[element.Timestamp.slice(0,4)] = downloadAvg[element.Timestamp.slice(0,4)] + element.Download
      }else{
        downloadData[element.Timestamp.slice(0,4)] = [];
        downloadData[element.Timestamp.slice(0,4)].push(element.Download)
        downloadAvg[element.Timestamp.slice(0,4)] = 0;
      }

      if (Object.keys(uploadData).includes(element.Timestamp.slice(0,4))) {
        uploadData[element.Timestamp.slice(0,4)].push(element.Upload)
        uploadAvg[element.Timestamp.slice(0,4)] = uploadAvg[element.Timestamp.slice(0,4)] + element.Upload
      }else{
        uploadData[element.Timestamp.slice(0,4)] = [];
        uploadData[element.Timestamp.slice(0,4)].push(element.Upload)
        uploadAvg[element.Timestamp.slice(0,4)] = 0;
      }

      if (Object.keys(pingData).includes(element.Timestamp.slice(0,4))) {
        pingData[element.Timestamp.slice(0,4)].push(element.Ping)
        pingAvg[element.Timestamp.slice(0,4)] = pingAvg[element.Timestamp.slice(0,4)] + element.Ping
      }else{
        pingData[element.Timestamp.slice(0,4)] = [];
        pingData[element.Timestamp.slice(0,4)].push(element.Ping)
        pingAvg[element.Timestamp.slice(0,4)] = 0;
      }

      if (Object.keys(distanceData).includes(element.Timestamp.slice(0,4))) {
        distanceData[element.Timestamp.slice(0,4)].push(element.Distance)
        if (element.Distance != "Unknown") {
          distanceAvg[element.Timestamp.slice(0,4)] = distanceAvg[element.Timestamp.slice(0,4)] + parseFloat(element.Distance)
        }
      }else{
        distanceData[element.Timestamp.slice(0,4)] = [];
        distanceData[element.Timestamp.slice(0,4)].push(element.Distance)
        distanceAvg[element.Timestamp.slice(0,4)] = 0;
      }

      sumDownload = sumDownload + element.Download
      sumUpload = sumUpload + element.Upload
      sumPing = sumPing + element.Ping
      sumDistance = sumDistance + element.Distance
    });

    if (returnFullData) {
      var fullData = {
        "download" : downloadData,
        "upload" : uploadData,
        "ping" : pingData,
        "distance" : distanceData
      }
    }else{
      fullData = null
    }

    Object.keys(downloadAvg).forEach(year => {
      downloadAvg[year] = downloadAvg[year] / downloadData[year].length 
      uploadAvg[year] = uploadAvg[year] / uploadData[year].length 
      pingAvg[year] = pingAvg[year] / pingData[year].length 
      distanceAvg[year] = distanceAvg[year] / distanceData[year].length 
    });

    averages = {
      "download" : downloadAvg,
      "upload" : uploadAvg,
      "ping" : pingAvg,
      "distance" : distanceAvg
    }
    resolve({"averages" : averages, "full data" : fullData});    
  });
}

function formatToCSV(averagesDict) {
  let csvString = 'Time,Ping,Download,Upload---'
  Object.keys(averagesDict["averages"]["download"]).forEach(year => {
    csvString += year+'/01/01 12:00:00,'
    csvString += averagesDict["averages"]["ping"][year]+','
    csvString += averagesDict["averages"]["download"][year]+','
    csvString += averagesDict["averages"]["upload"][year]
    csvString += '---'
  });
  return csvString
}

module.exports = {
  uniqueIPs,
  annualAverage,
  formatToCSV
}