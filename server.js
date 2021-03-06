var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
app.use(express.static(__dirname + '/server'));
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

const dataHelper = require('./read_speed_data');

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

app.listen(12345, function () {
  console.log('Example app listening on port 12345!');
});