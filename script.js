// import vaccine from './covid.js'
//console.log('vaccine', vaccine)
let flags = null
let vaccine = null
let clickConfirmed = false
// we MUST NOT RELOAD fetch crossdomain every sort action!!! (only once in DOMContentLoaded)
/*async*/ function displayData({ type, target }) {
  try {
    console.warn('flags', flags)
    const sort = target?.id ?? 'confirmed'
    document.querySelector('table').innerHTML = ''
    // const covid = await (await fetch('https://pomber.github.io/covid19/timeseries.json')).json()
    // console.warn(covid);
    //const vaccine = await (await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')).json()
    //console.log(vaccine);
    const stats = []
    let html = `<tr><th></th><th>Country</th><th><a id="confirmed" >Confirmed</a></th><th><a href="#" id="deaths">Deaths</a></th><th><a href="#" id="lethality">Lethality</a></th><th><a href="#"
    id="peopleVaccinated">Vaccinated</a></th><th><a href="#" id="confirmedByPop">% Confirmed by pop</a></th></tr>`
    let totalConfirmed = 0
    let totalDeaths = 0
    let totalRecovered = 0
    let totalPop = 0
    if (!flags) {
      for (const [k, v] of Object.entries(flags)) {
        //console.log(v);
        if (v.name.includes('Hong Kong')) {
          flags['Hong Kong'] = v.emoji
        } else if (v.name.includes('Macau')) {
          flags['Macao'] = v.emoji
        } else {
          // Côte d'Ivoire
          flags[v.name.replaceAll('&', 'and').replaceAll('’', "'").normalize("NFD").replace(/[\u0300-\u036f]/g, "")] = v.emoji
        }
        delete flags[k]
      }
    }
    
    //console.log('flags ', flags);
    let flagNotFound = 0
    for (const [indicativeCountry, infoDatas] of Object.entries(vaccine)) {
      //console.warn('location from vaccine api ', infoDatas)
      //vaccine[infoDatas.location] = infoDatas
      //delete vaccine[indicativeCountry]

      const country = infoDatas.location
      if (country === 'World') {
      console.log('World', infoDatas);
        totalPop = infoDatas.population
      }
      //const reg = new RegExp(country, 'i')
      // const resultReg =
      const flag = flags[country] ?? flagNotFound++
      const { data } = infoDatas
      const lastVaccined = data.filter(v => v.people_vaccinated)
      let peopleVaccinated = 0
      let newVaccinations = 0
      let dateInfoVaccination = null
      if(lastVaccined.length > 0) {
        //console.log('lastVaccined ',lastVaccined[lastVaccined.length - 1]);
        peopleVaccinated = lastVaccined[lastVaccined.length - 1].people_vaccinated ?? 0
        newVaccinations = lastVaccined[lastVaccined.length - 1].new_vaccinations ?? 0
        dateInfoVaccination = lastVaccined[lastVaccined.length - 1].date
      } else {
        console.warn('no vaccine datas for ', country);
      }
      const lastData = data[data.length - 1]
      const confirmed = lastData.total_cases ?? 0
      const newConfirmed = lastData.new_cases ?? 0
      // for Macao for instance no deaths report
      const newDeaths = lastData.new_deaths ?? 0
      const deaths = lastData.total_deaths ?? 0
      const lethality = +((deaths / confirmed) * 100).toFixed(2)
      //const recovered = data[data.length - 1].recovered
      const countryPop = infoDatas.population
      totalConfirmed += confirmed
      totalDeaths += deaths
      //totalRecovered += recovered
      const confirmedByPop = +((confirmed / countryPop) * 100).toFixed(2)
      stats.push({
        country,
        confirmed,
        deaths,
        flag,
        //recovered,
        newConfirmed,
        newDeaths,
        //newRecovered,
        newVaccinations,
        peopleVaccinated,
        dateInfoVaccination,
        lethality,
        confirmedByPop
      })
    }
    console.log('flagNotFound', flagNotFound);
    console.warn('totalDeaths', totalDeaths)
    console.warn('totalPop', totalPop)
    if (type === 'click') {
      clickConfirmed = !clickConfirmed
    }
    const sortedByMax = stats.sort((a, b) => clickConfirmed ? a[sort] - b[sort] : b[sort] - a[sort])
    html += sortedByMax.map(v => `<tr><td>${v.flag}</td><td>${v.country}</td><td>${v.confirmed}<br>+ ${v.newConfirmed || ''}</td><td>${v.deaths}<br>+ ${v.newDeaths || ''}</td><td>${v.lethality} %</td><td>${v.peopleVaccinated}<br>+ ${v.newVaccinations || ''}<br /><font color="green">${v.dateInfoVaccination}</font></td><td>${v.confirmedByPop} %</td></tr>`).join('')
    document.querySelector('table').innerHTML += html
    document.querySelector('div').innerHTML = `<div>Total confirmed ${new Intl.NumberFormat('de-DE').format(totalConfirmed)} <br> Total deaths ${new Intl.NumberFormat('de-DE').format(totalDeaths)} <br> <span class="danger">% lethality ${((totalDeaths / totalConfirmed) * 100).toFixed(2)} %</span><br>
   <!-- Total recovered ${0/*new Intl.NumberFormat('de-DE').format(totalRecovered)*/}<br>-->
    <u>new => </u><font color="brown">% death by world pop ${(totalDeaths / totalPop * 100).toFixed(3)} %</font><br>
    <!--<span class="good">% recovered ${((totalRecovered / totalConfirmed) * 100).toFixed(2)} %</span><br>-->
    <a href="https://fr.wikipedia.org/wiki/Pand%C3%A9mie_de_Covid-19_par_pays#D%C3%A9tail_des_cas_par_pays" target="_blank">Wikipedia article</a></div>`
    setFilterListeners()
  } catch (e) {
    document.write(e.toString())
  }
} // en displayData

document.addEventListener('DOMContentLoaded', async e => {
  flags = await (await fetch('https://unpkg.com/country-flag-emoji-json@1.0.2/json/flag-emojis.json')).json()
  // the following json is very heavy already >55mo
  vaccine = await (await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')).json()
  displayData(e)
  setFilterListeners()
})
const setFilterListeners = () => {
  [...document.querySelectorAll('a')].filter(v => v.id).forEach(v => v.addEventListener('click', displayData))
}
