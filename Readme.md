# geojson vector maps

Used libs
=========
* links from the email: http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames, http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
* obviously d3
* http://leafletjs.com/
* https://gist.github.com/ZJONSSON/5529395
* node modules: express, pg, lodash

Installation
============
1. call in psql: CREATE EXTENSION postgis;
2. ./psql databasename < dump.sql 
3. edit db.config.json

Usage
=====
navigate to 8080
