var express = require('express');
var fs = require('fs');
var exphbs = require('express-handlebars');

var app = express();
app.use(express.static(__dirname + '/server'));
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
  fs.readFile('internet_speed.txt', 'utf8', function (err,data) {
    if (err) { res.send("Error reading the file: "+err); }
    data = data.replaceAll("\n","---");
    console.log(">>> Read "+data.length+" data points");
    var context = { m : data };
    res.render('history',context);
  });
});

app.listen(12345, function () {
  console.log('Example app listening on port 12345!');
});

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
