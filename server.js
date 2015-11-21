var express = require('express');
var geoutil = require('./lib/geoutil');
var sprintf = require('sprintf').sprintf;
var query = require('pg-query');
var zoomrules = require('./lib/zoomrules').zoomrules;
var _ = require('lodash');
var app = express();
app.use("/static", express.static(__dirname + '/static'));
app.get("/", function (req, res, next) {
	res.redirect("/static");
});

var dbconfig = require('./db.config');

var dbcredentials = sprintf("postgres://%s:%s@%s:%s/%s", dbconfig.username, dbconfig.password, dbconfig.host, dbconfig.port, dbconfig.database);
console.log("dbcredentials", dbcredentials);
query.connectionParameters = dbcredentials;

query('select min(kmh) as kmhmin, max(kmh) kmhmax, 18 maxzoom, 3 mapversion from ch_2po_4pgr', [], function(err, rows, result) {
  var constants = _.first(rows);
  var zoomToLessOrEqualsKmh = {};
  app.get('/api/1/constants', function (req, res, next) {
    res.jsonp(constants);
  });
  app.get('/api/1/map-version/:mapversion/vector/:z/:x/:y', function (req, res, next) {
    console.log(req.params);
      try {
        var mapversion = parseInt(req.mapversion);
        var z = parseInt(req.params.z);
        var x = parseInt(req.params.x);
        var y = parseInt(req.params.y);

        var ltrb = geoutil.ltrb(z,x,y);
        
        var sqlparams = [zoomrules(z).kmh, zoomrules(z).clazz, ltrb.l, ltrb.t, ltrb.r, ltrb.b]
        console.log("sqlparams", sqlparams);
        var sql = "SELECT ST_ASGEOJSON(geom_way) as jsontext \
                      FROM ch_2po_4pgr \
                      WHERE kmh >= $1::numeric\
                       and clazz <= $2::numeric\
                       and ST_INTERSECTS\
                       (\
                          ch_2po_4pgr.geom_way\
                          ,ST_SETSRID\
                          (\
                            ST_MAKEBOX2D\
                            (\
                              ST_POINT\
                              (\
                                $3::numeric\
                                ,$4::numeric\
                              )\
                              ,ST_POINT\
                              (\
                                $5::numeric\
                                ,$6::numeric\
                              )\
                            )\
                           ,4326\
                          )\
                        )";
        query(sql,sqlparams,function (err, rows, result) {
          if (err) console.log(err);
          res.setHeader('Cache-Control', 'public, max-age=31557600')
          res.json({
            type: "FeatureCollection",
            features: _.pluck(rows,'jsontext').map(JSON.parse).map(function(i){return {type: "Feature", geometry:i}})
          });
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
    });
  app.listen(8080);
});