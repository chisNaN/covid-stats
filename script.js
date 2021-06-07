import data from './datapop2021.js'
let clickConfirmed = false
async function displayData({ type, target }) {
  try {
    const sort = target?.id ?? 'confirmed'
    document.querySelector('table').innerHTML = ''
    const covid = await (await fetch('https://pomber.github.io/covid19/timeseries.json')).json()
    const flags = await (await fetch('https://unpkg.com/country-flag-emoji-json@1.0.2/json/flag-emojis.json')).json()
    const vaccine = await (await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')).json()
    console.log(vaccine);
    const stats = []
    let html = `<tr><th></th><th>Country</th><th><a href="#" id="confirmed" >Confirmed</a></th><th><a href="#" id="deaths">Deaths</a></th><th><a href="#" id="lethality">Lethality</a></th><th><a href="#"
    id="recovered">Recovered</a></th><th><a href="#" id="confirmedByPop">% Confirmed by pop</a></th></tr>`
    let totalConfirmed = 0
    let totalDeaths = 0
    let totalRecovered = 0
    let totalPop = 0
    for (const [k, v] of Object.entries(flags)) {
      flags[v.code] = v.emoji
      delete flags[k]
    }
    for (const [indicativeCountry, infoDatas] of Object.entries(vaccine)) {
      //console.warn('location from vaccine api ', infoDatas)
      vaccine[infoDatas.location] = infoDatas
      delete vaccine[indicativeCountry]
    }
    console.log(data);
    for (const [k, v] of Object.entries(data)) {
      //console.log('flag => ',flags.[v.cca2]);
      //console.log('cca2', v.cca2);
      if(vaccine[v.name]) {
        console.warn('confirmed for' ,v.name, vaccine[v.name].data[vaccine[v.name].data.length - 1].total_cases);
        // some places has no confirmed measure like wallis and futuna

      } else {
        // some places like puerto rico does not exist in vaccine api
        console.warn(k, 'st country undef', v.name)

        return
      }
      /*if (covid[v.name] || covid[v.cca2]) {
        const country = v.name || v.cca2
        if (v.cca2 === 'US') {
          console.warn('us', vaccine[v.name]);
        }
        const covStat = covid[v.name || v.cca2]
        if (!covStat) {
          console.warn('1st country undef', country)
          return
        }
        const confirmed = covStat[covStat.length - 1].confirmed
        const deaths = covStat[covStat.length - 1].deaths
        const lethality = ((deaths / confirmed) * 100).toFixed(2)
        const recovered = covStat[covStat.length - 1].recovered
        const countryPop = v.pop2020.replace(/\./g, '')
        totalPop += +countryPop
        totalConfirmed += confirmed
        totalDeaths += deaths
        totalRecovered += recovered
        const confirmedByPop = ((confirmed / countryPop) * 100).toFixed(2)
        let newConfirmed = 0
        if (confirmed - covStat[covStat.length - 2].confirmed > 0) {
          newConfirmed = ` +${confirmed - covStat[covStat.length - 2].confirmed}`
        } else if (confirmed - covStat[covStat.length - 2].confirmed < 0) {
          newConfirmed = `<span style="color:red; font-weight: bold;">${confirmed - covStat[covStat.length - 2].confirmed}</span>`
        }
        let newDeaths = 0
        if (deaths - covStat[covStat.length - 2].deaths > 0) {
          newDeaths = ` +${deaths - covStat[covStat.length - 2].deaths}`
        } else if (deaths - covStat[covStat.length - 2].deaths < 0) {
          newDeaths = `<span style="color:red; font-weight: bold;">${deaths - covStat[covStat.length - 2].deaths}</span>`
        }
        let newRecovered = 0
        if (recovered - covStat[covStat.length - 2].recovered > 0) {
          newRecovered = ` +${recovered - covStat[covStat.length - 2].recovered}`
        } else if (recovered - covStat[covStat.length - 2].recovered < 0) {
          newRecovered = `<span style="color:red; font-weight: bold;">${recovered - covStat[covStat.length - 2].recovered}</span>`
        }
        stats.push({
          country,
          confirmed,
          deaths,
          recovered,
          newConfirmed,
          newDeaths,
          newRecovered,
          lethality,
          confirmedByPop
        })
      } else {
        console.warn('no matching from covid api file to api file ', v.cca2);
      }
      /*if (type === 'click') {
        clickConfirmed = !clickConfirmed
      }
      const sortedByMax = stats.sort((a, b) => clickConfirmed ? a[sort] - b[sort] : b[sort] - a[sort])
      html += sortedByMax.map(v => `<tr><td>${flags.find(v2 => v2.name.includes(v.country) || v2.code.includes(v.country))?.emoji}</td><td>${v.country}</td><td>${v.confirmed}<br>${v.newConfirmed || ''}</td><td>${v.deaths}<br>${v.newDeaths || ''}</td><td>${v.lethality} %</td><td>${v.recovered}<br>${v.newRecovered || ''}</td><td>${v.confirmedByPop} %</td></tr>`).join('')
      document.querySelector('table').innerHTML += html
      document.querySelector('div').innerHTML = `<div>Total confirmed ${new Intl.NumberFormat('de-DE').format(totalConfirmed)} <br> Total deaths ${new Intl.NumberFormat('de-DE').format(totalDeaths)} <br> <span class="danger">% lethality ${((totalDeaths / totalConfirmed) * 100).toFixed(2)} %</span><br>
      Total recovered ${new Intl.NumberFormat('de-DE').format(totalRecovered)}<br>
      <u>new => </u><font color="brown">% death by world pop ${(totalDeaths / totalPop * 100).toFixed(3)} %</font><br>
      <span class="good">% recovered ${((totalRecovered / totalConfirmed) * 100).toFixed(2)} %</span><br>
      <a href="https://fr.wikipedia.org/wiki/Pand%C3%A9mie_de_Covid-19_par_pays#D%C3%A9tail_des_cas_par_pays" target="_blank">Wikipedia article</a></div>`
      setFilterListeners()
      */
    } // end for of
    console.warn('stats first loop', stats);

    for (let [country, v] of Object.entries(covid)) {
      if (country === 'Korea, South') {
        country = 'South Korea'
      }

      const confirmed = v[v.length - 1].confirmed
      const deaths = v[v.length - 1].deaths
      const lethality = ((deaths / confirmed) * 100).toFixed(2)
      const recovered = v[v.length - 1].recovered

      let confirmedByPop = 0
      const countryFromPop = data.find(v2 => country === v2.name || country === v2.cca2)
      if (countryFromPop) {
        const countryPop = countryFromPop.pop2020.replace(/\./g, '')
        totalPop += +countryPop
        confirmedByPop = ((confirmed / countryPop) * 100).toFixed(2)
      }else{
        confirmedByPop = 0
      }
      totalConfirmed += confirmed
      totalDeaths += deaths
      totalRecovered += recovered
      let newConfirmed = 0
      if (confirmed - v[v.length - 2].confirmed > 0) {
        newConfirmed = ` +${confirmed - v[v.length - 2].confirmed}`
      } else if (confirmed - v[v.length - 2].confirmed < 0) {
        newConfirmed = `<span style="color:red; font-weight: bold;">${confirmed - v[v.length - 2].confirmed}</span>`
      }
      let newDeaths = 0
      if (deaths - v[v.length - 2].deaths > 0) {
        newDeaths = ` +${deaths - v[v.length - 2].deaths}`
      } else if (deaths - v[v.length - 2].deaths < 0) {
        newDeaths = `<span style="color:red; font-weight: bold;">${deaths - v[v.length - 2].deaths}</span>`
      }
      let newRecovered = 0
      if (recovered - v[v.length - 2].recovered > 0) {
        newRecovered = ` +${recovered - v[v.length - 2].recovered}`
      } else if (recovered - v[v.length - 2].recovered < 0) {
        newRecovered = `<span style="color:red; font-weight: bold;">${recovered - v[v.length - 2].recovered}</span>`
      }
      stats.push({
        country,
        confirmed,
        deaths,
        recovered,
        newConfirmed,
        newDeaths,
        newRecovered,
        lethality,
        confirmedByPop
      })
    } // end for of
    if (type === 'click') {
      clickConfirmed = !clickConfirmed
    }
    const sortedByMax = stats.sort((a, b) => clickConfirmed ? a[sort] - b[sort] : b[sort] - a[sort])
    html += sortedByMax.map(v => `<tr><td>${flags.find(v2 => v2.name.includes(v.country) || v2.code.includes(v.country))?.emoji}</td><td>${v.country}</td><td>${v.confirmed}<br>${v.newConfirmed || ''}</td><td>${v.deaths}<br>${v.newDeaths || ''}</td><td>${v.lethality} %</td><td>${v.recovered}<br>${v.newRecovered || ''}</td><td>${v.confirmedByPop} %</td></tr>`).join('')
    document.querySelector('table').innerHTML += html
    document.querySelector('div').innerHTML = `<div>Total confirmed ${new Intl.NumberFormat('de-DE').format(totalConfirmed)} <br> Total deaths ${new Intl.NumberFormat('de-DE').format(totalDeaths)} <br> <span class="danger">% lethality ${((totalDeaths / totalConfirmed) * 100).toFixed(2)} %</span><br>
    Total recovered ${new Intl.NumberFormat('de-DE').format(totalRecovered)}<br>
    <u>new => </u><font color="brown">% death by world pop ${(totalDeaths / totalPop * 100).toFixed(3)} %</font><br>
    <span class="good">% recovered ${((totalRecovered / totalConfirmed) * 100).toFixed(2)} %</span><br>
    <a href="https://fr.wikipedia.org/wiki/Pand%C3%A9mie_de_Covid-19_par_pays#D%C3%A9tail_des_cas_par_pays" target="_blank">Wikipedia article</a></div>`
    setFilterListeners()
  } catch (e) {
    document.write(e.toString())
  }
} // en displayData

document.addEventListener('DOMContentLoaded', async e => {
  await displayData(e)
  setFilterListeners()
})
const setFilterListeners = () => {
  [...document.querySelectorAll('a')].filter(v => v.id).forEach(v => v.addEventListener('click', displayData))
}
