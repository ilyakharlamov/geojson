var express = require('express');
var geoutil = require('./lib/geoutil');
var sprintf = require('sprintf').sprintf;
var query = require('pg-query');
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

query('select min(kmh) as kmhmin, max(kmh) kmhmax, 15 maxzoom, 3 mapversion from ch_2po_4pgr', [], function(err, rows, result) {
  var constants = _.first(rows);
  var zoomToLessOrEqualsKmh = {};
  app.get('/api/1/constants', function (req, res, next) {
    res.jsonp(constants);
  });
  (function fill_zoomToLessOrEqualsKmh_iife () {
    var step = (constants.kmhmax - constants.kmhmin) / constants.maxzoom;
    var i = constants.maxzoom + 1;
    while (i--) {
      zoomToLessOrEqualsKmh[i] = constants.kmhmax - step * i;
    }
    console.log("zoomToLessOrEqualsKmh", zoomToLessOrEqualsKmh);
  })();
  app.get('/api/1/map-version/:mapversion/vector/:z/:x/:y', function (req, res, next) {
    console.log(req.params);
      try {
        var mapversion = parseInt(req.mapversion);
        var z = parseInt(req.params.z);
        var x = parseInt(req.params.x);
        var y = parseInt(req.params.y);

        var ltrb = geoutil.ltrb(z,x,y);
        
        var sqlparams = [zoomToLessOrEqualsKmh[z], ltrb.l, ltrb.t, ltrb.r, ltrb.b]
        console.log("sqlparams", sqlparams);
        var sql = "SELECT ST_ASGEOJSON(geom_way) as jsontext \
                      FROM ch_2po_4pgr \
                      WHERE kmh >= $1::numeric\
                       and ST_INTERSECTS\
                       (\
                          ch_2po_4pgr.geom_way\
                          ,ST_SETSRID\
                          (\
                            ST_MAKEBOX2D\
                            (\
                              ST_POINT\
                              (\
                                $2::numeric\
                                ,$3::numeric\
                              )\
                              ,ST_POINT\
                              (\
                                $4::numeric\
                                ,$5::numeric\
                              )\
                            )\
                           ,4326\
                          )\
                        )";

       /* sql = "SELECT ST_ASGEOJSON(geom_way) as jsontext \
                      FROM ch_2po_4pgr \
                      WHERE kmh >= "+sqlparams[0]+"\
                       and ST_INTERSECTS\
                       (\
                          ch_2po_4pgr.geom_way\
                          ,ST_SETSRID\
                          (\
                            ST_MAKEBOX2D\
                            (\
                              ST_POINT\
                              (\
                                "+sqlparams[1]+"\
                                ,"+sqlparams[2]+"\
                              )\
                              ,ST_POINT\
                              (\
                                "+sqlparams[3]+"\
                                ,"+sqlparams[4]+"\
                              )\
                            )\
                           ,4326\
                          )\
                        )";
        console.log("sql",sql);*/
        query(sql,[],function (err, rows, result) {
          if (err) console.log(err);
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