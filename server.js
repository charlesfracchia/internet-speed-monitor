var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
app.use(express.static(__dirname + '/server'));
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

const port = 12345;
const dataHelper = require('./read_speed_data');
const analyticsHelper = require('./analyze_speed_data');

app.get('/', function (req, res) {
  (async function(){
    let speed_data = await dataHelper.parseCSV('internet_log.csv');
    let data_for_frontend = await speed_data.replace(/\n/g, "---");

    let measurements = (data_for_frontend.match(/---/g) || []).length-1;
    let last_date = speed_data.trim().split("\n").slice(-1)[0].split(",")[0];
    console.log(">>> Read "+measurements+" data points. Latest data from: "+last_date);

    var context = { m : data_for_frontend };
    res.render('history',context);
  })();
});

app.get('/annual', function (req, res) {
  (async function(){
    let speed_data = await dataHelper.parseCSV('internet_log.csv', true)
    let num_ips = await analyticsHelper.uniqueIPs(speed_data)
    let avgData = await analyticsHelper.annualAverage(speed_data, false)
    let formattedAvgData = await analyticsHelper.formatToCSV(avgData)
    // let data_for_frontend = await speed_data.replace(/\n/g, "---");
    // let measurements = (data_for_frontend.match(/---/g) || []).length-1;
    // let last_date = speed_data.trim().split("\n").slice(-1)[0].split(",")[0];
    let years = Object.keys(avgData["averages"]["download"])
    console.log(">>> Read "+(years.length-1)+" years. Data spans: "+years[0]+" - "+years[years.length-1]);

    var context = { m : formattedAvgData };
    res.render('annual',context);
  })();
});

app.listen(port, function () {
  console.log('Server running on port '+port);
});