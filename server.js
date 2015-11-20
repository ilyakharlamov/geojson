var express = require('express');
var app = express();
app.use("/static", express.static(__dirname + '/static'));
app.get("/", function (req, res, next) {
	res.redirect("/static");
});
app.get('/api/1/map-version/3/:z/:x/:y', function (req, res, next) {
	console.log(req.params);

    try {

      var z = parseInt(req.params.z);
      var x = parseInt(req.params.x);
      var y = parseInt(req.params.y);

      var key = z + '-' + x + '-' + y;

      var c = cache.get(key);

      if (c) {
        res.send(c);
        return;
      }

      var box = util.getLTRBbox(z, x, y);

      db.getTileData(box.left, box.top, box.right, box.bottom)
        .then(function (data) {

          return parseResult(data);

        })
        .then(function (featureCollection) {

          cache.set(key, featureCollection);
          res.send(featureCollection);

        })
        .catch(function (err) {
          logger.error(err);
          next(err);
        });


    } catch (err) {

      logger.error(err);
      next(err);
    }

  });
app.listen(8080);