function tile2long(x,z) {
  return (x/Math.pow(2,z)*360-180);
}

function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

function ltrb (z, x, y) {
  var l = tile2long(x, z);
  var t = tile2lat(y, z);
  var r = tile2long(x+1, z);
  var b = tile2lat(y+1, z);
  return {
    l: l,
    t: t,
    r: r,
    b: b
  };
}

exports.tile2long = tile2long;
exports.tile2lat = tile2lat;
exports.ltrb = ltrb;