
window.onresize =  lagagraphs;

function lagagraphs(){
  console.log(document.getElementsByClassName('active'));
  oneVW = 0.8 * window.innerWidth;
  let thisActiveElement = document.getElementsByClassName('active');
  if(thisActiveElement[2].className === "tablinksChamp active") {
    let whatChamp = thisActiveElement[2].innerText;
    console.log(whatChamp);
  }
  // console.log('outer ' + oneVW);
  if (piechampion) {
    drawPie(piechampion, 'chart3', pieWhich);
  }
  if (scatter) {
    drawScatter(scatter, 'chart1',false, oneVW);
  }
  if (barsgraphs) {
    drawBars(barsgraphs, 'chart2', ' top 10 most played champs', 'champs');
  }
  if (linechart) {
    drawChart(linechart, 'chart4', 'chart5');
  }
  // console.log(which);
  if (which) {
    console.log('scatterChampion ' + scatterChampion);
    if (scatterChampion) {
      oneVW = 0.5 * window.innerWidth;
      console.log('inner ' + oneVW);
      drawScatter(scatterChampion, schatterChampionId,true, oneVW);
    }
  } else if (scatterChampion) {
    oneVW = 0.5 * window.innerWidth;
    drawBars(scatterChampion, schatterChampionId);
  }
};
let scatter;

let barsgraphs;

let linechart;

let piechampion;

let pieWhich;

let scatterChampion;

let schatterChampionId;

let championgraph;
// Breyta sem segir til um hvort þetta sé bars eða scatter fyrir champion;
let which = false;
function teikniTest() {
  const breidd = 1920;
  console.log(oneVW);
  const stuss = deathsAtMinute(filteredDB);
  drawScatter(deathScatterchart(stuss), 'chart1', false, oneVW);
  const x = topXmostPlayedChamps(10);
  const bars = championsToBarArray(x);
  drawBars(bars, 'chart2', 'Top 10 most played champs', 'champs');
  drawChart(datesToChart(gamesByLoad()), 'chart4', 'chart5');
  drawPie(championPieChart(), 'chart3', 'champions');
}

function dateCharts(time) {
  const array = [];
  filteredDB.forEach((game) => {
    const gt = game.date;
    const gamedate = gt.getFullYear() + '/' + (gt.getMonth() + 1) + '/' + gt.getDate();
    if (compareFormattedDates(time, gamedate) === 0) array.push(game);
  });
  const games = {
    B: {
      W: 0,
      L: 0,
    },
    R: {
      W: 0,
      L: 0,
    },
  };
  array.forEach((game) => {
    const players = game.players;
    let team;
    players.forEach((player) => {
      if (isInArray(yourSummonerName, player.summonername)) {
        team = player.team;
      }
    });
    if (team === '1') {
      if (game.game_result === 'W') {
        games.B.W += 1;
      } else games.B.L += 1;
    } else if (game.game_result === 'W') {
      games.R.W += 1;
    } else games.R.L += 1;
  });
  const data = [['games this day', 'sup']];
  data.push(['Blue side wins', games.B.W]);
  data.push(['Blue side losses', games.B.L]);
  data.push(['Red side wins', games.R.W]);
  data.push(['Red side losses', games.R.L]);
  return data;
}


function drawChart(array, id, id2) {
  google.charts.setOnLoadCallback(draw);

  // þarf að setja setOnLoadCallback ehv fall. svo þetta virkar svo sem, smá
  // skitamix
  function draw() {
    const data = google.visualization.arrayToDataTable(array);
    linechart = array;
    const options = {
      title: 'Loading time as a function of date',
      curveType: 'function',
      legend: { position: 'bottom' },
      width: oneVW,
      height: 450,
    };
    const chart = new google.visualization.LineChart(document.getElementById(id));
    chart.draw(data, options);
    google.visualization.events.addListener(chart, 'select', selectHandler);
    function selectHandler() {
      // Event handler sem generatera nýtt pie chart ef ýtt er á date chartið
      // Ef þú settir ekki inn neitt id þá
      if (id2) {
        // þetta er mesta skítamix ever like legit ever
        const node = document.getElementById(id);
        const parent = node.parentElement;
        const grandparent = parent.parentElement;
        // Gerir þetta til að forðast að þetta crashi
        if (chart.getSelection()[0]) {
          const select = chart.getSelection()[0].row;
          const time = data.Tf[select].c[0].v;
          // Bý til nýtt div til að teikna pie chartið í
          const pie = document.createElement('div');
          pie.setAttribute('id', id2);
          pie.setAttribute('class', 'chart');
          grandparent.appendChild(pie);
          drawPie(dateCharts(time), id2);
          parent.appendChild(pie);
        }
      }
    }
  }
}

function drawBars(array, id, titles, subtitles) {
  google.charts.setOnLoadCallback(draw);

  // smá skítamix með onloadCallBack.
  function draw() {
    barsgraphs = array;
    const data = google.visualization.arrayToDataTable(array);
    const options = {
      title: titles,
      subtitle: subtitles,
      bars: 'vertical',
      width: oneVW,
      height:450,
    }; // Required for chart3 Bar Charts.
    const chart = new google.charts.Bar(document.getElementById(id));
    chart.draw(data, options);
  }
}

function drawScatter(array, id, championSpecific, breidd) {
  if(championSpecific) {
    //const leng  = ;
    let maxmin = array[array.length - 1][0].replace(/[^0-9.]/g, '');
    for (let i = 1; i < maxmin; i++) {
      if(parseInt(array[i][0].replace(/[^0-9.]/g, '')) === i - 1){
      } else {
        const tempArray = [];
        const bla = i - 1;
        const tempString = bla + "minute";
        tempArray.push(tempString);
        tempArray.push(0);
        array.splice(i,0,tempArray);
      }
    }
  }
  //console.log(array);
  google.charts.setOnLoadCallback(draw);
  function draw() {
    // Tekur array og breytir því á formið sem þarf til að geta gert graf úr því
    const data = google.visualization.arrayToDataTable(array);
    scatter = array;
    const options = {
      title: 'scatterchart of every death per min',
      width: breidd,
      legend: 'none',
    };    // Required for chart3 Bar Charts.
    const chart = new google.visualization.ScatterChart(document.getElementById(id));
    chart.draw(data, options);
     if (championSpecific) {
       // scatterChampion = array;
       // Ef sett er inn championSpecific breytu þá verður skilgreindur
       // eventhandler á formið.
       scatterChampion = array;
       scatterChampionId = id;
       google.visualization.events.addListener(chart, 'select', selectHandler);
    }
    function selectHandler() {
      // Eventhandler sem fer í gang þegar ýtt er á scatter chartið
      // Birtir barchart fyir winrate fyrir eitthvað spes fylki sem er á
      // sama sniði og filteredDB og birtir winrates úr því
      const winrate = winratePerTime(championSpecific);
      scatterChampion = winrate;
      which = true;
      schatterChampionId = id;
      drawBars(winrate, id, 'winrate as a  function of time', 'wins');
    }
  }
}


function drawPie(array, id, hierarchy) {
  google.charts.setOnLoadCallback(draw);

  function draw() {
    const data = google.visualization.arrayToDataTable(array);
    pieWhich = hierarchy;
    piechampion = array;
    const options = {
      title: 'champion game stats',
      bars: 'vertical',
      // Til að fá 3D shapeið í þetta.
      is3D: true,
      width: oneVW,
      height: 450,
    }; // Required for chart3 Bar Charts.
    const chart = new google.visualization.PieChart(document.getElementById(id));
    if (hierarchy === 'champions') {
      // Tjékkar hvaða fall á að kalla á ef breytan er jafngild champions
      google.visualization.events.addListener(chart, 'select', selectHandler);
    }
    if (hierarchy === 'champion') {
      // Sama og fallið fyrir ofan
      google.visualization.events.addListener(chart, 'select', selectHand);
    }
    function selectHandler() {
      // Event handler fyrir þegar breytan er jafngild champions
      // Seinna er bara þegar ýtt er á ritið þá er sótt gildið úr þeirri
      // slæsu sem ýtt var á.
      const select = chart.getSelection()[0].row;
      const champion = data.lc[select][0].Df;
      const info = infoAboutChampions(champion);
      function championToPie() {
        const stats = [];
        stats.push([champion, 'stats on every side']);
        stats.push(['Blue Wins', info.B.W]);
        stats.push(['Blue losses', info.B.L]);
        stats.push(['Red wins', info.R.W]);
        stats.push(['Red losses', info.R.L]);
        return stats;
      }
      drawPie(championToPie(), id, 'champion');
    }
    function selectHand() {
      drawPie(championPieChart(), id, 'champions');
    }
    chart.draw(data, options);
  }
}

// Fall sem tekur við fylki á sama sniði og filteredDB og nær í allar
// Dagsetningar úr því og gerir fylki úr því á því sniði svo hægt sé að
// gerir rit úr því.
function datesToChart(array) {
  const chart = [];
  for (const date in array) {
    const newPoint = [];
    newPoint.push(date);
    let sum = 0;
    array[date].forEach((time) => {
      // tökum meðaltalið frá hverjum degi til að setja fyrir hvern dag ef svo
      // skyldi gerast að hann spilaði fleiri en einn leiki á einhverum gefnum degi.
      sum += time / array[date].length;
    });
    newPoint.push(sum);
    chart.push(newPoint);
  }
  function comparator(a, b) {
    // Samanburðarfall til að raða fylki af fylkjum með fyrsta stak sem formattaðan
    // streng fyrir dagsetningu
    if (compareFormattedDates(a[0], b[0]) < 0) return -1;
    if (compareFormattedDates(a[0], b[0]) > 0) return 1;
    return 0;
  }
  chart.sort(comparator);
  chart.unshift(['loading time', 'date']);
  return chart;
}

// process
function infoAboutChampions(champion) {
  // Object sem búið er að frumstilla öll gildin í. Ef svo skyldi gerast að
  // Fallið tæki við champion þar sem viðkomadi spilaði enga leiki þá
  // skilar það frumtillta objectinum.
  const infoAboutChampion = {
    patches: {},
    totalDeaths: 0,
    totalGameTime: 0,
    B: { W: 0, L: 0 },
    R: { W: 0, L: 0 },
    skins: {},
  };
  // Fjöldi leikja á viðeigandi champion
  const numgames = champions[champion].numgames;
  if (numgames === 0) return infoAboutChampion;

  for (let i = 0; i < numgames; i += 1) {
    // Lykkja sem ítrar í gegnum alla leikina fyrir viðeigandi champion
    // Allt fyrir neðan er bara að bomba hlutum inn.
    infoAboutChampion.totalDeaths += champions[champion][i].deaths;
    infoAboutChampion.totalGameTime += champions[champion][i].gameTime;
    if (!infoAboutChampion.patches[champions[champion][i].patch]) {
      infoAboutChampion.patches[champions[champion][i].patch] = {
        W: 0,
        L: 0,
      };
    }
    if (champions[champion][i].gameResult === 'W') {
      infoAboutChampion.patches[champions[champion][i].patch.W] += 1;
      if (champions[champion][i].team === '1') {
        infoAboutChampion.B.W += 1;
      } else {
        infoAboutChampion.R.W += 1;
      }
    } else {
      infoAboutChampion.patches[champions[champion][i].patch.L] += 1;
      if (champions[champion][i].team === '1') {
        infoAboutChampion.B.L += 1;
      } else {
        infoAboutChampion.R.L += 1;
      }
    }
    infoAboutChampion.skins[champions[champion][i].skin] =
    (infoAboutChampion.skins[champions[champion][i].skin] || 0) + 1;
  }
  return infoAboutChampion;
}


function isInArray(array, item) {
  // Tjékkar hvort hlutur sé í fylki.
  for (let i = 0; i < array.length; i += 1) {
    if (item === array[i]) return true;
  }
  return false;
}

function gamesByLoad() {
  // Tekur mepal loading time fyrir hverja dagsetningu og skilar fylki fyrir það
  // og formattar dagsetningu.
  const dates = {};
  for (let i = 0; i < filteredDB.length; i += 1) {
    const dt = filteredDB[i].date;
    const date = dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate();
    if (!dates[date]) {
      dates[date] = [];
    }
    dates[date].push(filteredDB[i].loading_time);
  }
  return dates;
}


function compareFormattedDates(date1, date2) {
  // tekur strengi á forminu "yyyy/mm/dd" og skilar hvor er stærri.
  const indices1 = [];
  for (let i = 0; i < date1.length; i += 1) {
    // maus
    if (date1[i] === '/') indices1.push(i);
  }
  const indices2 = [];
  for (let i = 0; i < date2.length; i += 1) {
    if (date2[i] === '/') indices2.push(i);
  }
  // Tékkar hvort árið sé hið sama og ber svo saman
  const int1 = parseInt(date1.substring(0, indices1[0]), 10);
  const int2 = parseInt(date2.substring(0, indices2[0]), 10);
  if (int1 !== int2) return (int1 - int2);

  // Búið er að gá hvort ár sé hið sama svo bera saman mánuði.
  const int11 = parseInt(date1.substring(indices1[0] + 1, indices1[1]), 10);
  const int22 = parseInt(date2.substring(indices2[0] + 1, indices2[1]), 10);

  // Búið er að bera saman mánuði og ár svo bera saman dag númer
  if (int11 !== int22) return int11 - int22;
  const index111 = date1.substring(indices1[1] + 1, date1.length);
  const index222 = date2.substring(indices2[1] + 1, date2.length);

  const int111 = parseInt(index111, 10);
  const int222 = parseInt(index222, 10);
  return int111 - int222;
}
function deathsAtMinute(array) {
  // Tjékar á leik segir til um á hvaða mínútu átti deaths sér stað í leik.
  const data = {};
  array.forEach((game) => {
    const deaths = game.deaths;
    deaths.forEach((death) => {
      const hhmmss = secondsTominute(death);
      data[hhmmss] =
      (data[hhmmss] || 0) + 1;
    });
  });
  return data;
}
function championDeathArray(champion) {
  // ítrar í gegnum filteredDB og kíkir á allar leiki sem yourSummoner var að
  // spila í og gær hvort hann var að spila þennan champion
  // Ef svo er þá bætir hann þeim leik við fylkið.
  const data = [];
  for (let i = 0; i < filteredDB.length; i += 1) {
    const players = filteredDB[i].players;
    for (let k = 0; k < players.length; k += 1) {
      if (isInArray(yourSummonerName, players[k].summonername)
      && players[k].champion === champion) {
        data.push(filteredDB[i]);
      }
    }
  }
  return data;
}

function secondsTominute(seconds) {
  // Breytir sekúndum í purea mínutur.
  const minutes = Math.floor(seconds / 60);
  return minutes + 'minute';
}

function championPieChart() {
  // Býr til pie chart fyrir leiki hjá öllum champions.
  const data = [];
  for (const champion in champions) {
    if (champions[champion].numgames > 0) {
      const newPoint = [];
      newPoint.push(champion);
      newPoint.push(champions[champion].numgames);
      data.push(newPoint);
    }
  }
  data.unshift(['Champions', 'number of games']);
  return data;
}
function deathScatterchart(array) {
  // Býr til fylki af fylkjum  og bombar dagsetningum og shit í það.
  const data = [];
  for (const minute in array) {
    const newPoint = [];
    newPoint.push(minute);
    newPoint.push(array[minute]);
    data.push(newPoint);
  }
  function comparator(a, b) {
    // Fall til að raða fylki af fylkjum
    const a1 = a[0].indexOf('m');
    const b1 = b[0].indexOf('m');

    const an = parseInt(a[0].substring(0, a1), 10);
    const bn = parseInt(b[0].substring(0, b1), 10);

    if (an < bn) return -1;
    if (an > bn) return 1;
    return 0;
  }
  const chart = data.sort(comparator);
  chart.unshift(['minute', 'deaths']);
  return chart;
}


function topXmostPlayedChamps(x) {
  const XmostPlayed = [];
  let mostPlayed = '';
  let max = 0;
  for (let i = 0; i < x; i += 1) {
    // Þessi lykkja ítrar frá 0 og upp að x
    for (const champion in champions) {
      // Fer í gegnum allt champions arrayið við hverja ítrun að finna most played
      if (!isInArray(XmostPlayed, champion)) {
        if (champions[champion].numgames > max) {
          mostPlayed = champion;
          max = champions[champion].numgames;
        }
      }
    }
    max = 0;
    XmostPlayed.push(mostPlayed);
  }
  return XmostPlayed;
}

function championsToBarArray(arraychampion) {
  const barArray = [];
  const headers = ['champions', 'Bwins', 'Bloses', 'Rwins', 'Rloses'];
  barArray.push(headers);

  for (let i = 0; i < arraychampion.length; i += 1) {
    // Fer í gegnum allt arrayið og kallar á infoAboutChampions fyrir hvert stak.
    // info about champion nær í allar viðeigandi upplýsingar.
    const info = infoAboutChampions(arraychampion[i]);
    const Bwins = info.B.W;
    const Blose = info.B.L;

    const Rwins = info.R.W;
    const Rlose = info.R.L;

    const newBars = [arraychampion[i], Bwins, Blose, Rwins, Rlose];
    barArray.push(newBars);
  }
  return barArray;
}

// Segir til um winrate úr fylki af leikjum.
function winratePerTime(array) {
  const minutes = {};
  array.forEach((game) => {
    // Ítrar í gegnum alla leikin og skrái game time og shift
    // breytir game time í margfeldi af 5.
    let length = parseInt(secondsTominute(game.game_time), 10);
    length -= (length % 5);
    if (!minutes[length]) {
      minutes[length] = [];
    }
    if (game.game_result === 'W') minutes[length].push(1);
    else { minutes[length].push(0); }
  });
  const data = [];
  for (const key in minutes) {
    // Býr til nýtt data fylki til að gera rit úr.
    let sum = 0;
    const newPoint = [];
    minutes[key].forEach((game) => {
      sum += (game) / minutes[key].length;
    });
    newPoint.push(key);
    newPoint.push(sum);
    data.push(newPoint);
  }
  data.unshift(['winrate', 'minutes of fives']);
  return data;
}
