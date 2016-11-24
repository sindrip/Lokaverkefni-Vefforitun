// Inniheldur heildarupplýsingar um alla leiki með þér
const filteredDB = [];
// Búið að flokka leikina eftir champions
const champions = {};
// listi yfir þín summonername
const yourSummonerName = [];
// total games played
let totalGamesPlayed = 0;
// listi yfir alla players
const playerIDArray = {};
function vinnaFylki() {
  // console.log('poop bob');
  fillMainChampDiv();
  fillGenInfoDiv();
  initializeChampionCards();
}
// skilar H:M:S formati ur sekundum
function secondsToHMS(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 3600 % 60);
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
}

function fillMainChampDiv() {
  let currTopChamp;
  let currTopChampValue = 0;
  for (const key in champions) {
    totalGamesPlayed += champions[key].numgames;
    if (champions[key].numgames > currTopChampValue) {
      currTopChampValue = champions[key].numgames;
      currTopChamp = key;
    }
  }
  // console.log(currTopChamp);

  fillChampionElement(champInfoFiller(currTopChamp), 'mainChampion');
}
function fillChampionElement(championObject, elementID) {
  const elementIDFound = document.getElementById(elementID);
  elementIDFound.classList.add('championElement');
  const ulListElement = document.createElement('ul');
  ulListElement.classList.add('thisChampUl');
  const divdivdiv = document.createElement('div');
  divdivdiv.classList.add('thisChamp');
  // big mynd
  // finna top skin
  let currTopSkin = 0;
  for (const key in championObject.favSkin) {
    if (championObject.favSkin[key] > currTopSkin) { currTopSkin = key; }
  }
  const ChampSkinImage = document.createElement('img');
  ChampSkinImage.classList.add('skinImage');
  ChampSkinImage.src = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + championObject.championName + '_' + currTopSkin + '.jpg';
  // elem.setAttribute('height', '768');
  // elem.setAttribute('width', '1024');
  elementIDFound.appendChild(ChampSkinImage);
  // small mynd
  // console.log(ChampSkinImage.src);
  const ChampSmallImage = document.createElement('img');
  ChampSmallImage.src = 'http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/' + championObject.championName + '.png';
  divdivdiv.appendChild(ChampSmallImage);
  // name
  const champName = document.createElement('p');
  let fontSize = 5;
  if (championObject.championName.length > 8) {
    fontSize = 3;
  }
  champName.style.fontSize = fontSize + 'vw';
  champName.innerHTML = championObject.championName;
  divdivdiv.appendChild(champName);
  elementIDFound.appendChild(divdivdiv);
  // listitems
  const liGP = document.createElement('li');
  liGP.innerHTML = 'Games played: ' + championObject.totalGames;
  ulListElement.appendChild(liGP);
  const liBS = document.createElement('li');
  liBS.innerHTML = 'On blue side: ' + championObject.blueGames;
  ulListElement.appendChild(liBS);
  const liRS = document.createElement('li');
  liRS.innerHTML = 'On red side: ' + championObject.redGames;
  ulListElement.appendChild(liRS);
  const liWR = document.createElement('li');
  liWR.innerHTML = 'Winrate: ' + ((championObject.winrate.W / championObject.totalGames) * 100).toFixed(2) + '%';
  ulListElement.appendChild(liWR);
  const liTP = document.createElement('li');
  liTP.innerHTML = 'Time played: ' + secondsToHMS(championObject.timePlayed);
  ulListElement.appendChild(liTP);
  const liAG = document.createElement('li');
  liAG.innerHTML = 'Average game time: ' + secondsToHMS(championObject.timePlayed / championObject.totalGames);
  ulListElement.appendChild(liAG);
  const liPC = document.createElement('li');
  liPC.innerHTML = '% of champs played: ' + ((championObject.totalGames / totalGamesPlayed) * 100).toFixed(2) + '%';
  ulListElement.appendChild(liPC);
  elementIDFound.appendChild(ulListElement);
}

function champInfoFiller(champion) {
  const collectedinfo = {
    championName: champion,
    totalGames: champions[champion].numgames,
    blueGames: 0,
    redGames: 0,
    winrate: {
      W: 0,
      L: 0,
    },
    timePlayed: 0,
    favSkin: {},
  };

  for (let i = 0; i < collectedinfo.totalGames; i += 1) {
    const gameSelected = champions[champion][i];
    // console.log(gameSelected['team'] === 1);
    if (gameSelected.team === '1') {
      collectedinfo.blueGames += 1;
    } else {
      collectedinfo.redGames += 1;
    }
    collectedinfo.winrate[gameSelected.gameResult] += 1;
    collectedinfo.timePlayed += gameSelected.gameTime;
    collectedinfo.favSkin[gameSelected.skin] = (collectedinfo.favSkin[gameSelected.skin] || 0) + 1;
  }
  // console.log(collectedinfo);
  return collectedinfo;
}

function fillGenInfoDiv() {
  const GenInfoObj = {
    numGames: 0,
    gameTime: 0,
    loadTime: 0,
    winrate: {
      W: 0,
      L: 0,
    },
    blueGames: 0,
    redGames: 0,
    uniquePlayers: 0,
    totalDeaths: 0,
  };
  filteredDB.forEach((item) => {
    GenInfoObj.numGames += 1;
    GenInfoObj.gameTime += item.game_time;
    GenInfoObj.loadTime += item.loading_time;
    GenInfoObj.totalDeaths += item.deaths.length;
    GenInfoObj.winrate[item.game_result] += 1;
    // console.log(item['game_result']);
  });
  for (const key in champions) {
    for (const key2 in champions[key]) {
      if (key2 !== 'numgames') {
        // console.log(champions[key][key2]['gameResult']);
        // console.log(champions[key][key2]['team']);
        if (champions[key][key2].team === '1') {
          GenInfoObj.blueGames += 1;
        } else {
          GenInfoObj.redGames += 1;
        }
      }
    }
    // console.log('--=-==');
  }
  console.log(playerIDArray);
  for (const key3 in playerIDArray) {
    GenInfoObj.uniquePlayers += 1;
  }
  document.getElementById('sumonernames').innerHTML = 'Your summoner Names: ' + yourSummonerName;
  document.getElementById('GI1').innerHTML = 'Total games: ' + GenInfoObj.numGames;
  document.getElementById('GI2').innerHTML = 'Blue side: ' + GenInfoObj.blueGames;
  document.getElementById('GI3').innerHTML = 'Red side: ' + GenInfoObj.redGames;
  document.getElementById('GI4').innerHTML = 'Winrate: ' + ((GenInfoObj.winrate.W / GenInfoObj.numGames) * 100).toFixed(2) + '%';
  document.getElementById('GI5').innerHTML = 'Time spent loading: ' + secondsToHMS(GenInfoObj.loadTime);
  document.getElementById('GI6').innerHTML = 'Total playtime: ' + secondsToHMS(GenInfoObj.gameTime);
  document.getElementById('GI7').innerHTML = 'Average game time: ' + secondsToHMS(GenInfoObj.gameTime / GenInfoObj.numGames);
  document.getElementById('GI8').innerHTML = 'Total deaths: ' + GenInfoObj.totalDeaths;
  document.getElementById('GI9').innerHTML = 'Average death per game: ' + (GenInfoObj.totalDeaths / GenInfoObj.numGames).toFixed(2);
  document.getElementById('GI10').innerHTML = 'Unique players met: ' + GenInfoObj.uniquePlayers;
  console.log(GenInfoObj);
}
function openCity(evt, cityName, classNameID, classNameID2) {
  // Declare all variables
  let i;
  // Get all elements with class='tabcontent' and hide them
  const tabcontent = document.getElementsByClassName(classNameID2);
  for (i = 0; i < tabcontent.length; i += 1) {
    tabcontent[i].style.display = 'none';
  }
  // Get all elements with class='tablinks' and remove the class 'active'
  const tablinks = document.getElementsByClassName(classNameID);
  for (i = 0; i < tablinks.length; i += 1) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  // Show the current tab, and add an 'active' class to the link that opened the tab
  console.log(cityName);
  if (cityName in champions) {
    document.getElementById(cityName).style.display = 'flex';
  } else {
    document.getElementById(cityName).style.display = 'block';
  }
  evt.currentTarget.className += ' active';
}
function initializeChampionCards() {
  let lineCounter = 0;
  let activeUL;
  const papaElement = document.getElementById('Champions');
  for (const key in champions) {
    if (lineCounter === 0) {
      activeUL = document.createElement('ul');
      papaElement.appendChild(activeUL);
      activeUL.classList.add('tabChamp');
    }
    const activeLI = document.createElement('li');
    const activeA = document.createElement('a');
    activeA.setAttribute('href', 'javascript:void(0)');
    activeA.classList.add('tablinksChamp');
    const onclickString = 'openCity(event, \'' + key + '\', \'tablinksChamp\', \'tabcontentChamps\')';
    activeA.setAttribute('onclick', onclickString);
    const activeIMG = document.createElement('img');
    const championIconLink = 'http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/' + key + '.png';
    activeIMG.src = championIconLink;
    activeIMG.setAttribute('width', '100');
    activeIMG.setAttribute('height', '100');
    activeA.appendChild(activeIMG);
    const activeP = document.createElement('p');
    activeP.innerHTML = key;
    activeA.appendChild(activeP);
    activeLI.appendChild(activeA);
    activeUL.appendChild(activeLI);

    const activeDiv = document.createElement('div');
    activeDiv.classList.add('tabcontentChamps', 'overviewElement');
    activeDiv.setAttribute('id', key);
    // activeDiv.innerHTML = key;
    papaElement.appendChild(activeDiv);
    if (champions[key].numgames < 0) {
      activeDiv.innerHTML = key;
    } else {
      fillChampionElement(champInfoFiller(key), key);
    }
    lineCounter += 1;
    if (lineCounter === 8) { lineCounter = 0; }
  }
}
