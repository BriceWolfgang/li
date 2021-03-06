const assert = require('assert')
const maintainers = require('../_lib/maintainers.js')
const transform = require('../_lib/transform.js')

const country = 'iso1:SA'

const sum = (items) => items.map(stateAttribute => stateAttribute.Cases).reduce((a, b) => Number(a) + Number(b), 0)

const nameToCanonical = {
  // Name differences get mapped to the canonical names
  Mecca: "Makka",
  Medina: "Madinah",
  Hail: "Hayel",
  Jouf: "Jawf",
  "Al Jouf": "Al Jawf",
}

module.exports = {
  aggregate: "state",
  country,
  priority: 1,
  timeseries: true,
  friendly: {
    name: "Saudi Center for Disease Prevention and Control",
    url: "https://covid19.cdc.gov.sa/",
  },
  maintainers: [ maintainers.qgolsteyn, maintainers.camjc ],
  scrapers: [
    {
      startDate: "2020-01-14",
      crawl: [
        {
          type: "csv",
          url:
            "https://datasource.kapsarc.org/explore/dataset/saudi-arabia-coronavirus-disease-covid-19-situation/download/?format=csv&timezone=Australia/Sydney&lang=en&use_labels_for_header=true&csv_separator=,",
        },
      ],
      scrape ($, date, { getIso2FromName, groupBy }) {
        assert($.length > 0, "data is unreasonable")
        const attributes = $.filter(
          (item) => item["Daily / Cumulative"] === "Cumulative"
        ).filter((item) => item.Date === date)

        assert(
          attributes.length > 0,
          `data fetch failed, no fields for date: ${date}`
        )

        const groupedByState = groupBy(
          attributes,
          (attribute) => attribute.region
        )

        const states = []
        for (const [ stateName, stateAttributes ] of Object.entries(
          groupedByState
        )) {
          if (stateName !== "Total") {
            states.push({
              state: getIso2FromName({
                country,
                name: stateName,
                nameToCanonical,
              }),
              cases: sum(
                stateAttributes.filter(
                  (stateAttribute) => stateAttribute.Indicator === "Cases"
                )
              ),
              active: sum(
                stateAttributes.filter(
                  (stateAttribute) =>
                    stateAttribute.Indicator === "Active cases"
                )
              ),
              recovered: sum(
                stateAttributes.filter(
                  (stateAttribute) => stateAttribute.Indicator === "Recoveries"
                )
              ),
              deaths: sum(
                stateAttributes.filter(
                  (stateAttribute) => stateAttribute.Indicator === "Mortalities"
                )
              ),
            })
          }
        }

        const summedData = transform.sumData(states)
        assert(summedData.cases > 0, "Cases are not reasonable")
        states.push(summedData)

        return states
      },
    },
  ],
}
