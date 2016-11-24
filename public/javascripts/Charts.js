function teikniTest(){
  let x = topXmostPlayedChamps(10);
  let bars = championsToBarArray(x);
  drawBars(bars, 'chart2');
  drawChart(deathByGamelength(filteredDB), 'chart1');
  drawChart(datesToChart(gamesByLoad()), 'chart4');
  let cdeath = championDeathArray('Vi');
  let stuss = deathsAtMinute(cdeath);
  drawScatter(deathScatterchart(stuss), 'chart3');
  drawPie(championPieChart(), 'chart2', true);
}

function dateCharts(time){
  let array = [];
  filteredDB.forEach((game) => {
    let gt = game['date'];
    let gamedate = gt.getFullYear() + '/' + (gt.getMonth() + 1) + '/' + gt.getDate();
    if(compareFormattedDates(time, gamedate) === 0) array.push(game);
  });
  let games = {
    B: {
      W:0,
      L:0,
    },
    R: {
      W:0,
      L:0,
    },
  };
  array.forEach((game) => {
    let result = game['game_result'];
    let team = game['team'];
    if(team === '1') games['B'][result] +=1;
    else games['R'][result] += 1;
  });
  let data = [['games this day', 'sup']];
  data.push(['Blue side wins', games['B']['W']]);
  data.push(['Blue side losses', games['B']['L']]);
  data.push(['Red side wins', games['R']['W']]);
  data.push(['Red side losses', games['R']['L']]);
  return data;
}


function drawChart(array, id){
  google.charts.setOnLoadCallback(draw);

  //þarf að setja setOnLoadCallback ehv fall. svo þetta virkar svo sem, smá
  //skitamix
  function draw(){
    let data = google.visualization.arrayToDataTable(array);
        let options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };
        let chart = new google.visualization.LineChart(document.getElementById(id));
        chart.draw(data, options);
        google.visualization.events.addListener(chart, 'select', selectHandler);
        function selectHandler(){
          let select = chart.getSelection()[0]['row'];
          let time = data['Tf'][select]['c'][0]['v'];
          drawPie(dateCharts(time), 'chart4');
        }
  }
}

function drawBars(array, id){
  google.charts.setOnLoadCallback(draw);

  //smá skítamix með onloadCallBack.
  function draw(){
    let data = google.visualization.arrayToDataTable(array);
    let options = {
          chart: {
            title: 'champion game stats',
            subtitle: 'Wins and losses on both sides for most played champs',
          },
          bars: 'vertical'
        }; // Required for chart3 Bar Charts.
        let chart = new google.charts.Bar(document.getElementById(id));
        chart.draw(data, options);
  }
}

function drawScatter(array, id){
  google.charts.setOnLoadCallback(draw);

  function draw(){
    let data = google.visualization.arrayToDataTable(array);
    let options = {
          chart: {
            title: 'champion game stats',
            subtitle: 'Wins and losses on both sides for most played champs',
          },
          bars: 'vertical'
        }; // Required for chart3 Bar Charts.
        let chart = new google.visualization.ScatterChart(document.getElementById(id));
        chart.draw(data, options);
  }
}


function drawPie(array, id, hierarchy){
  google.charts.setOnLoadCallback(draw);

  function draw(){
    let data = google.visualization.arrayToDataTable(array);
    let options = {
          chart: {
            title: 'champion game stats',
            subtitle: 'Wins and losses on both sides for most played champs',
          },
          bars: 'vertical'
        }; // Required for chart3 Bar Charts.
        let chart = new google.visualization.PieChart(document.getElementById(id));
        if(hierarchy){
          google.visualization.events.addListener(chart, 'select', selectHandler);
        }
        else{
          google.visualization.events.addListener(chart, 'select', selectHand);
        }
        function selectHandler(e){
          let select = chart.getSelection()[0]['row'];
          let champion = data['lc'][select][0]['Df'];
          let info = infoAboutChampions(champion);
          function championToPie(){
            let stats = [];
            stats.push([champion, 'stats on every side']);
            stats.push(['Blue Wins', info['B']['W']]);
            stats.push(['Blue losses', info['B']['L']]);
            stats.push(['Red wins', info['R']['W']]);
            stats.push(['Red losses', info['R']['L']]);
            return stats;
          }
          drawPie(championToPie(), id, false);
        }
        function selectHand(){
          drawPie(championPieChart(), 'chart2', true)
        }
        chart.draw(data, options);
  }
}

function datesToChart(array){
  let chart = [];
  for(let date in array){
    let newPoint =[];
    newPoint.push(date);
    let sum = 0;
    array[date].forEach((time) => {
      sum += time/array[date].length;
    });
    newPoint.push(sum);
    chart.push(newPoint);
  }
  function comparator(a, b){
    if(compareFormattedDates(a[0], b[0]) < 0) return -1;
    if(compareFormattedDates(a[0], b[0]) > 0) return 1;
    return 0;
  }
  chart.sort(comparator);
  chart.unshift(['loading time', 'date']);
  return chart;
}

function deathByGamelength(array){
  let dataArray =[];
  for(let game = 0; game < array.length; game++){
    let newPoint = [];
    newPoint.push(array[game]['game_time'])
    newPoint.push(array[game]['deaths'].length)
    dataArray.push(newPoint);
  }
    dataArray = sortByX(0, dataArray);
    dataArray.unshift(['yo', 'yo'])
  return dataArray;
}




//process
function infoAboutChampions(champion){
  //Object sem búið er að frumstilla öll gildin í. Ef svo skyldi gerast að
  //Fallið tæki við champion þar sem viðkomadi spilaði enga leiki þá
  //skilar það frumtillta objectinum.
  const infoAboutChampion = {
    patches: {},
    totalDeaths: 0,
    totalGameTime: 0,
    B: {W: 0, L:0,},
    R: {W: 0, L:0},
    skins: {},
  }
  //Fjöldi leikja á viðeigandi champion
  const numgames = champions[champion]['numgames'];
  if(numgames === 0) return infoAboutChampion;

  for (let i = 0; i < numgames; i++) {
    //Lykkja sem ítrar í gegnum alla leikina fyrir viðeigandi champion
    //Allt fyrir neðan er bara að bomba hlutum inn.
    infoAboutChampion['totalDeaths'] += champions[champion][i]['deaths'];
    infoAboutChampion['totalGameTime'] += champions[champion][i]['gameTime'];
    if(!infoAboutChampion['patches'][champions[champion][i]['patch']]){
      infoAboutChampion['patches'][champions[champion][i]['patch']] ={
        W:0,
        L:0,
      }
    }
    if(champions[champion][i]['gameResult'] === 'W'){
      infoAboutChampion['patches'][champions[champion][i]['patch']]['W'] += 1;
      if(champions[champion][i]['team'] === '1'){
        infoAboutChampion['B']['W'] += 1;
      }
      else{
        infoAboutChampion['R']['W'] +=1;
      }
    }
    else{
      infoAboutChampion['patches'][champions[champion][i]['patch']]['L'] += 1;
      if(champions[champion][i]['team'] === '1'){
        infoAboutChampion['B']['L'] += 1;
      }
      else{
        infoAboutChampion['R']['L'] +=1;
      }
    }
    infoAboutChampion['skins'][champions[champion][i]['skin']]=
    (infoAboutChampion['skins'][champions[champion][i]['skin']]||0) +1;
  }
  return infoAboutChampion;
}


function isInArray(array, item){
  for(let i = 0; i < array.length;i++){
    if(item === array[i]) return true;
  }
  return false;
}
function sortByX(x, array){
  function comparator(a, b){
    if(a[x] < b[x]) return -1;
    if(b[x] < a[x]) return 1;
    return 0;
  }
  array = array.sort(comparator);
  return array;
}
function gamesByLoad(){
  let dates = {};
  for(let i = 0; i < filteredDB.length;i++){
    let dt = filteredDB[i]['date'];
    let date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    if(!dates[date]){
      dates[date] = [];
    }
    dates[date].push(filteredDB[i]['loading_time']);
  }
  return dates;
}


function compareFormattedDates(date1, date2){
  let indices1 = [];
  for(let i=0; i<date1.length;i++) {
    if (date1[i] === "/") indices1.push(i);
  }
  let indices2 = [];
  for(let i=0; i<date2.length;i++) {
    if (date2[i] === "/") indices2.push(i);
  }
  let int1 = parseInt(date1.substring(0, indices1[0]));
  let int2 = parseInt(date1.substring(0, indices2[0]));
  if(int1 !== int2) return (int1 - int2);


  let int11 = parseInt(date1.substring(indices1[0] + 1, indices1[1]));
  let int22 = parseInt(date2.substring(indices2[0] + 1, indices2[1]));


  if(int11 !== int22) return int11 - int22;
  let index111 = date1.substring(indices1[1] + 1, date1.length);
  let index222 = date2.substring(indices2[1] + 1, date2.length);

  let int111 = parseInt(index111);
  let int222 = parseInt(index222);
  return int111 - int222;
}
function deathsAtMinute(array){
  let data = {};
  array.forEach((game) =>{
    let deaths = game['deaths'];
    deaths.forEach((death) => {
      let hhmmss = secondsTominute(death);
      data[hhmmss]=
      (data[hhmmss] || 0) + 1;
    });
  });
  return data;
}
function championDeathArray(champion){
  let data = [];
  for (let i = 0; i < filteredDB.length; i++) {
    let players = filteredDB[i]['players'];
    for (let  k= 0; k < players.length; k++) {
      if(isInArray(yourSummonerName, players[k]['summonername'])
      && players[k]['champion'] === champion){
        data.push(filteredDB[i]);
      }
    }
  }
  return data;
}

function secondsTominute(seconds){
  let  minutes = Math.floor(seconds/60);
  return minutes + 'minute';
}

function championPieChart(){
  let data = [];
  for(let champion in champions){
    if(champions[champion]['numgames'] > 0){
      let newPoint = [];
      newPoint.push(champion);
      newPoint.push(champions[champion]['numgames']);
      data.push(newPoint);
    }
  }
  data.unshift(['Champions', 'number of games']);
  return data;
}
function deathScatterchart(array){
  let data = [];
  for(let minute in array){
    let newPoint = [];
    newPoint.push(minute);
    newPoint.push(array[minute]);
    data.push(newPoint);
  }
  function comparator(a, b){
    let a1 = a[0].indexOf('m');
    let b1 = b[0].indexOf('m');
    let an = parseInt(a[0].substring(0, a1));
    let bn = parseInt(b[0].substring(0, b1))
    if(an < bn) return -1;
    if(an > bn)return 1;
    return 0;
  }
  data = data.sort(comparator);
  data.unshift(['minute', 'deaths']);
  return data;
}
function championPieChart(){
  let data = [];
  for(let champion in champions){
    if(champions[champion]['numgames'] > 0){
      let newPoint = [];
      newPoint.push(champion);
      newPoint.push(champions[champion]['numgames']);
      data.push(newPoint);
    }
  }
  data.unshift(['Champions', 'number of games']);
  return data;
}

function topXmostPlayedChamps(x){
  let XmostPlayed = [];
  let mostPlayed = '';
  let max = 0
  for(let i = 0; i < x;i++){
    //Þessi lykkja ítrar frá 0 og upp að x
      for(let champion in champions){
        //Fer í gegnum allt champions arrayið við hverja ítrun að finna most played
        if(!isInArray(XmostPlayed, champion)){
          if(champions[champion]['numgames'] > max){
            mostPlayed = champion;
            max = champions[champion]['numgames'];
          }
        }
      }
      max = 0;
      XmostPlayed.push(mostPlayed);
    }
    return XmostPlayed;
}

function championsToBarArray(arraychampion){
  let barArray = [];
  let headers = ['champions', 'Bwins', 'Bloses', 'Rwins', 'Rloses'];
  barArray.push(headers);
  for(let i = 0; i < arraychampion.length;i++){
    //Fer í gegnum allt arrayið og kallar á infoAboutChampions fyrir hvert stak.
    //info about champion nær í allar viðeigandi upplýsingar.
    let info = infoAboutChampions(arraychampion[i]);
    let Bwins = info['B']['W'];
    let Blose = info['B']['L'];
    let Rwins = info['R']['W'];
    let Rlose = info['R']['L'];
    let newBars =[arraychampion[i], Bwins, Blose, Rwins, Rlose];
    barArray.push(newBars);
  }
  return barArray;
}
