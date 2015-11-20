var express = require('express');
var geoutil = require('./lib/geoutil');
var app = express();
app.use("/static", express.static(__dirname + '/static'));
app.get("/", function (req, res, next) {
	res.redirect("/static");
});
var dbconfig = require('./db.config');
app.get('/api/1/map-version/3/vector/:z/:x/:y', function (req, res, next) {
	console.log(req.params);

    try {

      var z = parseInt(req.params.z);
      var x = parseInt(req.params.x);
      var y = parseInt(req.params.y);
      console.log("dbconfig", dbconfig);
      res.json({
        "fu":"ck",
        "z":z,
        "x":x,
        "y":y,
        "long": geoutil.tile2long(x,z),
        "lat": geoutil.tile2lat(y,z)
      });

    } catch (err) {

      console.log(err);
      next(err);
    }

  });
app.listen(8080);