const fs = require('fs'),
  path = require('path');

const generatedAtRegex = /Product Generated At: (.*)/;
const validAtRegex = /Product Valid At: (.*)/;

let AuroraParser = {};

AuroraParser.version = require('./package.json').version;

AuroraParser.parseAuroraActivityData = rawData => {
  let data = rawData.split('#');
  data = data[data.length - 1].replace(/\n/, '');
  let latitudes = data.split('\n');
  latitudes.splice(512, latitudes.length);
  let dataPoints = [];
  latitudes.forEach(latitude => {
    longitudes = latitude.replace(/\s{2,}/g, ',').split(',');
    longitudes.shift();
    dataPoints.push(longitudes);
  });
  return dataPoints.reverse();
}

AuroraParser.createJSONObject = data => {
  let dataPoints = [];
  data.reverse().forEach((latitude, lat) => {
    let latDegreePoint = (180 / data.length);
    let latDegree = -90 + ((latDegreePoint / 2) + (lat * latDegreePoint));
    let lons = [];
    latitude.forEach((longitude, lon) => {
      let lonDegreePoint = (360 / latitude.length);
      let lonDegree = -180 + ((lonDegreePoint / 2) + (lon * lonDegreePoint));
      lons.push({
        "lon": lonDegree,
        "activity": longitude
      });
    });
    dataPoints.push({
      "lat": latDegree,
      "lons": lons
    });
  });
  return dataPoints;
}

AuroraParser.parseData = rawData => {
  let validAt = body.match(validAtRegex)[1];
  let generatedAt = body.match(generatedAtRegex)[1];
  let data = AuroraParser.parseAuroraActivityData(rawData);
  return {
    validAt: validAt,
    generatedAt: generatedAt,
    data: AuroraParser.createJSONObject(data)
  };
}

module.exports = AuroraParser;
