# Reports

This doc compares a sample Corona Data Scraper (CDS) record with a Li record.  _If you note any errors in this doc, please [open an issue](https://github.com/covidatlas/li/issues/new/choose), notify us on Slack, or issue a Pull Request._

- [General notes](#general-notes)
- [locations.json](#locationsjson)
- [timeseries-byLocation.json](#timeseries-bylocationjson)
  * [Combining Data Sources](#combining-data-sources)
- [timeseries-jhu.csv](#timeseries-jhucsv)
- [timeseries-tidy.csv](#timeseries-tidycsv)
- [timeseries.csv](#timeseriescsv)
- [timeseries.json](#timeseriesjson)
- [features.json](#featuresjson)

<!-- <small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small> -->

## General notes

* **locationID:** Every location in Li is identified with a unique `locationID`, comprised of iso1, iso2, and fips codes from https://github.com/hyperknot/country-levels.  Examples: `iso1:US` = United States, `iso1:us#iso2:us-al` = State of Alabama, `iso1:us#iso2:us-al#fips:01125` = Tuscaloosa County, Alabama.
* **Integration testing samples:** samples for automated test verification are in `tests/integration/events/reports/expected-results`.
* **Combining data sources:** Sometimes multiple sources cover the same location.  For example, JHU, New York Times, and California sources may all submit data for California.  These sources are combined in the final reports where possible, and conflicts are resolved by priority.  See [Combining Data Sources](#combining-data-sources).
* **Common changes:** Most reports add `locationID` and `slug` (a url-friendly location representation, e.g. "butte-county-california-us")


## locations.json

<table>
<tr><th>CDS record</th><th>Li record</th></tr>

<tr>
<td>

```
{
  "country": "Austria",
  "url": "https://info.gesundheitsministerium.at",
  "maintainers": [
    {
      "name": "Quentin Golsteyn",
      "github": "qgolsteyn",
      "flag": "<graphic>"
    }
  ],
  "sources": [
    {
      "url": "https://info.gesundheitsministerium.at",
      "name": "Austrian Ministry of Health"
    }
  ],
  "state": "Lower Austria",
  "rating": 0.5098039215686274,
  "coordinates": [
    15.7605,
    48.221000000000004
  ],
  "tz": [
    "Europe/Vienna"
  ],
  "featureId": "iso2:AT-3",
  "population": 1653419,
  "populationDensity": 86.1501096312734,
  "countryId": "iso1:AT",
  "stateId": "iso2:AT-3",
  "name": "Lower Austria, Austria",
  "level": "state"
},

```

</td>
<td>

```
{
  "locationID": "iso1:us#iso2:us-ca#fips:06007",
  "slug": "butte-county-california-us",
  "name": "Butte County, California, US",
  "coordinates": [
    -121.6,
    39.67
  ],
  "countryID": "iso1:US",
  "countryName": "United States",
  "population": 219186,
  "tz": "America/Los_Angeles",
  "level": "county",
  "stateID": "iso2:US-CA",
  "stateName": "California",
  "countyID": "fips:06007",
  "countyName": "Butte County",
  "created": "2020-06-26T01:21:44.104Z",
  "sources": [
    "json-source"
  ],
  "maintainers": [
    {
      "name": "John Smith",
      "github": "jsmith42"
    }
  ],
  "links": [
    {
      "name": "Canadian COVID Rolling Task Force",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ],
  "populationDensity": 51.7139
}
```

</td>
</tr>
</table>

## timeseries-byLocation.json

<table>
<tr><th>CDS record</th><th>Li record</th></tr>

<tr>
<td>

```
{
  "Aargau, Switzerland": {
      "coordinates": [
          8.0725,
          47.378
      ],
      "country": "Switzerland",
      "countryId": "iso1:CH",
      "dates": {
          "2020-06-02": {
              "cases": 1177,
              "deaths": 43,
              "discharged": 1060
          },
          ...
          "2020-06-06": {
              "cases": 1177,
              "deaths": 43,
              "discharged": 1060,
              "growthFactor": 1
          }
      },
      "featureId": "iso2:CH-AG",
      "level": "state",
      "maintainers": [
          {
              "flag": "\ud83c\udde8\ud83c\udde6",
              "github": "qgolsteyn",
              "name": "Quentin Golsteyn"
          }
      ],
      "name": "Aargau, Switzerland",
      "population": 678207,
      "populationDensity": 485.70234973285847,
      "rating": 0.43137254901960786,
      "state": "Aargau",
      "stateId": "iso2:CH-AG",
      "tz": [
          "Europe/Zurich"
      ],
      "url": "https://github.com/daenuprobst/covid19/"
  },
```

</td>
<td>

```
{
  "locationID": "iso1:us#iso2:us-ca#fips:06007",
  "slug": "butte-county-california-us",
  "name": "Butte County, California, US",
  "coordinates": [
    -121.6,
    39.67
  ],
  "countryID": "iso1:US",
  "countryName": "United States",
  "population": 219186,
  "tz": "America/Los_Angeles",
  "level": "county",
  "stateID": "iso2:US-CA",
  "stateName": "California",
  "countyID": "fips:06007",
  "countyName": "Butte County",
  "populationDensity": 51.7139,
  "timeseries": {
    "2020-05-21": {
      "cases": 21,
      "deaths": 4,
      "tested": 210,
      "hospitalized": 1,
      "icu": 10
    },
    ...
  },
  "timeseriesSources": {
    "2020-05-21..2020-06-18": "us-ca",
    "2020-06-19": { "us-ca": [ "deaths" ], "jhu": [ "cases" ] }
  },
  "sources": [
    "us-ca", "jhu"
  ],
  "maintainers": [
    {
      "name": "John Smith",
      "github": "jsmith42"
    }
  ]
}
```

</td>
</tr>
</table>

#### Changes

* added locationID, slug, sources, timeseriesSources, potentially add warnings
* tz is not in an array
* removed rating, url, featureId

#### Combining Data Sources

The data fields in a given record can be supplied by many sources: one source may return cases and deaths, and another return hospitalizations and tests.  The field `timeseriesSources` shows where each field comes from.

A shorthand is shown for the date ranges for which the sources supplied data.  For example, `"2020-05-21 .. 2020-06-18": "src"` means that `src` supplied the data from 05-21 to 06-18.

If there are conflicts in the data (e.g., multiple sources return `cases`, but they're inconsistent), a `warnings` element is added.  e.g.,

```
"warnings": {
  "2020-06-19": {
    "cases": "conflict (src1: 3, src2: 2, src3: 1)",
    "deaths": "conflict (src2: 22, src3: 11)"
  },
  ...
```


## timeseries-jhu.csv

### CDS record

```
name,level,city,county,state,country,lat,long,population,url,aggregate,tz,2020-06-02,2020-06-03,...
"Lower Austria, Austria",state,,,Lower Austria,Austria,48.22100,15.7605,1653419,https:...js,,Europe/Vienna,2867,2868,...
```

### Li record

```
locationID,slug,name,level,city,county,state,country,lat,long,population,aggregate,tz,2020-05-21,2020-05-22
iso1:us#iso2:us-ca#fips:06007,butte-county-california-us,"Butte County, California, US",county,,Butte County,California,United States,39.67,-121.6,219186,,America/Los_Angeles,21,22
```



## timeseries-tidy.csv

### CDS record

```
name,level,city,county,state,country,population,lat,long,aggregate,tz,date,type,value
"Lower Austria, Austria",state,,,Lower Austria,Austria,1653419,48.221000000000004,15.7605,,Europe/Vienna,2020-06-02,cases,2867
```

### Li record

```
locationID,slug,name,level,city,county,state,country,lat,long,population,aggregate,tz,date,type,value
iso1:us#iso2:us-ca#fips:06007,butte-county-california-us,"Butte County, California, US",county,,Butte County,California,United States,39.67,-121.6,219186,,America/Los_Angeles,2020-05-21,cases,21
iso1:us#iso2:us-ca#fips:06007,butte-county-california-us,"Butte County, California, US",county,,Butte County,California,United States,39.67,-121.6,219186,,America/Los_Angeles,2020-05-21,deaths,4
```

## timeseries.csv

### CDS record

```
name,level,city,county,state,country,population,lat,long,url,aggregate,tz,cases,deaths,recovered,active,tested,hospitalized,hospitalized_current,discharged,icu,icu_current,growthFactor,date
"Lower Austria, Austria",state,,,Lower Austria,Austria,1653419,48.221000000000004,15.7605,https://info.gesundheitsministerium.at/data/GenesenTodesFaelleBL.js,,Europe/Vienna,2867,97,2678,92,,,,,,,,2020-06-02
```

### Li record

```
locationID,slug,name,level,city,county,state,country,lat,long,population,aggregate,tz,cases,deaths,recovered,active,tested,hospitalized,hospitalized_current,discharged,icu,icu_current,date
iso1:us#iso2:us-ca#fips:06007,butte-county-california-us,"Butte County, California, US",county,,Butte County,California,United States,39.67,-121.6,219186,,America/Los_Angeles,21,4,,,210,1,,,10,,2020-05-21
```

## timeseries.json

**Will not reproduce.**  This file is not atomic; it relies on some external resource or resources, and it's not clear on its own.

## features.json

The source data for this report is from https://github.com/hyperknot/country-levels.  The report is generated and posted to s3 using `./tools/geojsondb`.  See the README in that folder.

### Li record

The report is comprised of geojson and census data, keyed by `locationID`.

```
{
  "iso1:us#iso2:us-al#fips:01001": {
    "geometry": {
      "coordinates": [
        [
          [ -86.918, 32.664 ],
          [ -86.817, 32.66 ],
          ...
        ]
      ],
      "type": "Polygon"
    },
    "properties": {
      "area_m2": 1566509298,
      "census_data": {
        "AFFGEOID": "0500000US01001",
        "ALAND": 1539602123,
        "AWATER": 25706961,
        "COUNTYNS": "00161526",
        "LSAD": "06"
      },
      "center_lat": 32.54,
      "center_lon": -86.64,
      "countrylevel_id": "fips:01001",
      "county_code": 1,
      "fips": "01001",
      "name": "Autauga County",
      "name_long": "Autauga County, AL",
      "population": 55869,
      "state_code_int": 1,
      "state_code_iso": "US-AL",
      "state_code_postal": "AL",
      "timezone": "America/Chicago"
      },
    "type": "Feature"
  },
  ...
}
```
