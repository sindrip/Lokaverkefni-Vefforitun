'use strict';

// Contains raw info pulled from games
const filteredDB = [];
// Raw data sorted by champion
const champions = {};
// Your summoner name
const yourSummonerName = [];
// Total games played
const totalGamesPlayed = 0;
// List of all players
const playerIDArray = {};
// Data from riotAPI
let jsonRiot;
// Sorted array af champ names
const aToZChamps = [];
// List of people with wins losses
const playerIDArrayWithWins = {};
// initializes the display page
function vinnaFylki() {
  google.charts.load('current', { 'packages':[ 'corechart', 'bar'] });
  removeYourNamesFromPlayerId();
  fillMainChampDiv();
  fillGenInfoDiv();
  initializeChampionCards();
  fillFriendsTab();
  document.getElementById('Champions').style.display = 'block';
  teikniTest();
}
// returns H:M:S format from seconds
function secondsToHMS(a) {
  d = Number(a);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 3600 % 60);
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
}
// puts info into friendsTab
const friendsUlArray = [];
function fillFriendsTab() {
  // test fyrir top 20
  for (let i = 0; i < 25; i += 1) {
    const friendsUl = document.createElement('ul');
    friendsUl.classList.add('friendsList');
    const currTopFriend = findTopSummonerInPlayerId(playerIDArray);

    const friendNameLi = document.createElement('li');
    // friendNameLi.classList.add('list-group-item');
    friendNameLi.innerHTML = currTopFriend;
    friendsUl.appendChild(friendNameLi);

    const gamesPlayed = playerIDArrayWithWins[currTopFriend].W + playerIDArrayWithWins[currTopFriend].L;
    if (gamesPlayed > 0) {
      friendsUlArray.push(friendsUl);
    }
    const friendCountLi = document.createElement('li');
    // friendCountLi.classList.add('list-group-item');
    friendCountLi.innerHTML = 'Total games: ' + gamesPlayed;
    friendsUl.appendChild(friendCountLi);

    const winsLossString = 'Wins: ' + playerIDArrayWithWins[currTopFriend].W + ' : ' + 'Losses: ' + playerIDArrayWithWins[currTopFriend].L;
    const friendWinsLi = document.createElement('li');
    friendWinsLi.innerHTML = winsLossString;
    friendsUl.appendChild(friendWinsLi);

    const friendPercentLi = document.createElement('li');
    friendPercentLi.innerHTML = 'Winrate: ' + (100 * playerIDArrayWithWins[currTopFriend].W / (playerIDArrayWithWins[currTopFriend].L + playerIDArrayWithWins[currTopFriend]['W'])).toFixed(2) + '%';
    friendsUl.appendChild(friendPercentLi);

    const tempFriendArray = [currTopFriend];
    const friendChampLi = document.createElement('li');
    const friendChampObj = makeFriendChampObj(tempFriendArray);
    const friendTopChamp = findTopSummonerInPlayerId(friendChampObj);
    friendChampLi.innerHTML = 'Most played champion: ' + jsonRiot[friendTopChamp].name + '  ' + friendChampObj[friendTopChamp];
    friendsUl.appendChild(friendChampLi);

    delete playerIDArray[currTopFriend];
    // document.getElementById('Friends').appendChild(friendsUl);
  }
  putInfoIntoFriends();
}
// connects with buttons to resort
let whatSort = 'Win';
function resort(input) {
  whatSort = input;
  putInfoIntoFriends();
  toggleColors('friendButton', input);
}
// toggles button colors
function toggleColors(whatClass, whoActive) {
  const selectedElements = document.getElementsByClassName(whatClass);
  for (let i = 0; i < selectedElements.length; i += 1) {
    if ($(selectedElements[i]).hasClass('active')) {
      $(selectedElements[i]).toggleClass('active');
    }
  }
  $(document.getElementById(whoActive)).toggleClass('active');

}
// fills friends with sorted info
function putInfoIntoFriends() {
  if (whatSort === 'AtoZ') {
    // by alpabetical
    friendsUlArray.sort(function(a, b) {
    const A = a.childNodes[0].innerHTML.toLowerCase();
    const B = b.childNodes[0].innerHTML.toLowerCase();
      if (A < B) {
        return -1;
      }else if (A > B) {
        return  1;
      }else {
        return 0;
      }
    });
  } else if (whatSort === 'Win') {
  // by wins
    friendsUlArray.sort(function(a, b) {
      return b.childNodes[1].innerHTML.substring(13) - a.childNodes[1].innerHTML.substring(13);
    });
  } else if (whatSort === 'Rate') {
    friendsUlArray.sort(function(a, b) {

      const A = a.childNodes[1].innerHTML.substring(13);
      const B = b.childNodes[1].innerHTML.substring(13);
      if (A < 1 && B < 1) {
        return 0;
      }else if (A < 1) {
        return  1;
      }else if (B < 1) {
        return -1;
      } else if (A < 5 && B < 5) {
      }else if (A < 5) {
        return  1;
      }else if (B < 5) {
        return -1;
      } else {
      }

      const fronta = a.childNodes[3].innerHTML.substring(9);
      const resta = a.childNodes[3].innerHTML.substring(9).substring(0, fronta.length - 1)
      const frontb = b.childNodes[3].innerHTML.substring(9);
      const restb = b.childNodes[3].innerHTML.substring(9).substring(0, frontb.length - 1)
      return restb - resta;
    });
  }
  const friendElement = document.getElementById('Friends');
  for (let i = 0; i < friendsUlArray.length; i += 1) {
    friendElement.appendChild(friendsUlArray[i])
  }
}
// find top champ of friend
function makeFriendChampObj(yourNameInfo) {
  const topFriendChamp = {};
  filteredDB.forEach((arrayStak) => {
    const yourChampInfo = whatChampYouPlaying(arrayStak.players, yourNameInfo);
    if (yourChampInfo) {
      topFriendChamp[yourChampInfo.champion] = (topFriendChamp[yourChampInfo.champion] || 0) + 1;
    }
  });
  return topFriendChamp;
}
function findTopSummonerInPlayerId(arrayObject) {
  const currentTopSummoner = [0, 0];
  for (const key in arrayObject) {
    if (arrayObject[key] > currentTopSummoner[1]) {
      currentTopSummoner[0] = key;
      currentTopSummoner[1] = arrayObject[key];
    }
  }
  return currentTopSummoner[0];
}
// removes your name from the playerid object
function removeYourNamesFromPlayerId() {
  for (let i = 0; i < yourSummonerName.length; i += 1) {
    delete playerIDArray[yourSummonerName[i]];
  }
}

// finds your top champion
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

  fillChampionElement(champInfoFiller(currTopChamp), document.getElementById('mainChampion'));
}
// fills your top champion div
function fillChampionElement(championObject, elementID) {
  const elementIDFound = elementID;
  elementIDFound.classList.add('championElement');
  const ulListElement = document.createElement('ul');
  ulListElement.classList.add('thisChampUl');
  const divdivdiv = document.createElement('div');
  divdivdiv.classList.add('thisChamp');
  let currTopSkin = 0;
  for (const key in championObject.favSkin) {
    if (championObject.favSkin[key] > currTopSkin) { currTopSkin = key; }
  }
  const ChampSkinImage = document.createElement('img');
  ChampSkinImage.classList.add('skinImage');
  ChampSkinImage.src = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + championObject.championName + '_' + currTopSkin + '.jpg';
  elementIDFound.appendChild(ChampSkinImage);
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
  champName.innerHTML = jsonRiot[championObject.championName].name;
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
  const liDE = document.createElement('li');
  liDE.innerHTML = 'Average death per game: ' + (championObject.deaths / championObject.totalGames ).toFixed(2);
  ulListElement.appendChild(liDE);
  elementIDFound.appendChild(ulListElement);

  if (elementID.id !== 'mainChampion') {
    const cdeath = championDeathArray(championObject['championName']);
    if (cdeath.length != 0) {
      const stuss = deathsAtMinute(cdeath);
      const chart =  document.createElement('div');
      chart.setAttribute('id', championObject['championName'] + 'chart');
      drawScatter(deathScatterchart(stuss), championObject['championName'] + 'chart', cdeath);
      elementIDFound.appendChild(chart);
    }
  }
}
// gathers info about set champion
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
    deaths: 0,
  };

  for (let i = 0; i < collectedinfo.totalGames; i += 1) {
    const gameSelected = champions[champion][i];
    if (gameSelected.team === '1') {
      collectedinfo.blueGames += 1;
    } else {
      collectedinfo.redGames += 1;
    }
    collectedinfo.winrate[gameSelected.gameResult] += 1;
    collectedinfo.timePlayed += gameSelected.gameTime;
    collectedinfo.favSkin[gameSelected.skin] = (collectedinfo.favSkin[gameSelected.skin] || 0) + 1;
    collectedinfo.deaths += gameSelected.deaths;
  }
  return collectedinfo;
}
// fills the gen info div
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
  });
  for (const key in champions) {
    for (const key2 in champions[key]) {
      if (key2 !== 'numgames') {
        if (champions[key][key2].team === '1') {
          GenInfoObj.blueGames += 1;
        } else {
          GenInfoObj.redGames += 1;
        }
      }
    }
  }
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
}
// handler for active tabs
function setActiveTab(evt, classNameHTML, classNameID, classNameID2) {
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
  if(classNameHTML === 'Graphs') {
    document.getElementById(classNameHTML).style.display = 'flex';
  } else if (classNameHTML in champions) {
    document.getElementById(classNameHTML).style.display = 'flex';
  } else {
    document.getElementById(classNameHTML).style.display = 'block';
  }
  evt.currentTarget.className += ' active';
}

// creates champion cards in champion tab
const championUlList = [];
const championLiList = [];
let whatSortChamp = 'CAtoZ';
function initializeChampionCards() {
  let lineCounter = 0;
  let activeUL;
  const papaElement = document.getElementById('Champions');
  aToZChamps.forEach((key) => {
    if (lineCounter === 0) {
      activeUL = document.createElement('ul');
      championUlList.push(activeUL);
      //papaElement.appendChild(activeUL);
      activeUL.classList.add('tabChamp');
    }
    const activeLI = document.createElement('li');
    const activeA = document.createElement('a');
    activeA.setAttribute('href', 'javascript:void(0)');
    activeA.classList.add('tablinksChamp');
    const onclickString = 'setActiveTab(event, \'' + key + '\', \'tablinksChamp\', \'tabcontentChamps\')';
    activeA.setAttribute('onclick', onclickString);
    const activeIMG = document.createElement('img');
    const championIconLink = 'http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/' + key + '.png';
    if (champions[key].numgames === 0) {
      activeA.classList.add('nullGames');
    }
    activeIMG.src = championIconLink;
    activeIMG.setAttribute('width', '100');
    activeIMG.setAttribute('height', '100');
    activeA.appendChild(activeIMG);
    const activeP = document.createElement('p');
    activeP.innerHTML = jsonRiot[key].name;
    activeA.appendChild(activeP);
    activeLI.appendChild(activeA);
    //activeUL.appendChild(activeLI);

    const activeDiv = document.createElement('div');
    const temparray = [activeLI, activeDiv];
    championLiList.push(temparray);
    activeDiv.classList.add('tabcontentChamps', 'overviewElement');
    activeDiv.setAttribute('id', key);
    //papaElement.appendChild(activeDiv);
    if (champions[key].numgames < 0) {
      activeDiv.innerHTML = key;
    } else {
      fillChampionElement(champInfoFiller(key), activeDiv);
    }
    lineCounter += 1;
    if (lineCounter === 8) { lineCounter = 0; }
  });
  putCardsIntoChampions();
}
// sorts and puts info into champions
function putCardsIntoChampions() {
  // sorting methods
  if (whatSortChamp === 'CAtoZ') {
    // by alpabetical
    championLiList.sort(function(a, b) {
    const A = a[0].childNodes[0].childNodes[1].innerHTML.toLowerCase();
    const B = b[0].childNodes[0].childNodes[1].innerHTML.toLowerCase();
      if (A < B){
        return -1;
      }else if (A > B) {
        return  1;
      }else {
        return 0;
      }
    });
  } else if (whatSortChamp === 'CWin') {
  // by wins
    championLiList.sort((a, b) =>{
      return b[1].childNodes[2].childNodes[0].innerHTML.substring(13) - a[1].childNodes[2].childNodes[0].innerHTML.substring(13);
    });
  } else if (whatSortChamp === 'CRate') {
    // by winrate for games over 5
    championLiList.sort(function(a, b) {
      const less5 = filterLess5(a,b);
      if(!(less5 === false)){ return less5;}
      const fronta = a[1].childNodes[2].childNodes[3].innerHTML.substring(9);
      const frontb = b[1].childNodes[2].childNodes[3].innerHTML.substring(9);
      const resta = a[1].childNodes[2].childNodes[3].innerHTML.substring(9).substring(0, fronta.length - 1)
      const restb = b[1].childNodes[2].childNodes[3].innerHTML.substring(9).substring(0, frontb.length - 1)
      return restb - resta;
    });
  } else if (whatSortChamp === 'CDeaths') {
  // by deaths
    championLiList.sort(function(a, b) {
      const less5 = filterLess5(a,b);
      if (!(less5 === false)) { return less5; }
      return b[1].childNodes[2].childNodes[7].innerHTML.replace(/[^0-9.]/g, '') - a[1].childNodes[2].childNodes[7].innerHTML.replace(/[^0-9.]/g, '');
    });
  } else if (whatSortChamp === 'CTime') {
  // by gametime
    championLiList.sort(function(a, b) {
      const less5 = filterLess5(a,b);
      if (!(less5 === false)) { return less5; }
      const A = a[1].childNodes[2].childNodes[5].innerHTML.replace(/[^0-9.]/g, '')
      const realA = A.substring(0,2) * 60 + A.substring(2);
      const B = b[1].childNodes[2].childNodes[5].innerHTML.replace(/[^0-9.]/g, '')
      const realB = B.substring(0,2) * 60 + B.substring(2);
      return realB - realA;
    });
  }
  const papaElement = document.getElementById('Champions');
  let currUl = -1;
  for (let i = 0; i < championLiList.length; i++) {
    //friendElement.appendChild(championLiList[i])
    if(i % 8 === 0) {
      currUl += 1;
      papaElement.appendChild(championUlList[i / 8]);
    }
    championUlList[currUl].appendChild(championLiList[i][0]);
    papaElement.appendChild(championLiList[i][1]);
  }
}
// when sorting, champs with less then 5 games have low prio
function filterLess5(a,b) {
  const A = a[1].childNodes[2].childNodes[0].innerHTML.substring(13);
  const B = b[1].childNodes[2].childNodes[0].innerHTML.substring(13);

  if (A < 1 && B < 1) {
    return 0;
  }else if (A < 1) {
    return  1;
  }else if (B < 1) {
    return -1;
  } else if (A < 5 && B < 5) {
    return false;
  }else if (A < 5) {
    return  1;
  }else if (B < 5) {
    return -1;
  } else {
    return false;
  }
}
// connects with buttons to resort champs
function resortChamp(input) {
  whatSortChamp = input;
  putCardsIntoChampions();
  toggleColors('champButton', input);
}
// event listener for scrolling
// expands friends list and shows go to top button
const screenHeight = screen.height;
let disableTimer = true;
function yHandler() {
  if (document.getElementById('Friends').style.display !== 'block') {
    return;
  }
  const currentW1 = document.getElementById('Friends').offsetHeight;
  const currentW2 = document.getElementById('upperContainer').offsetHeight;
  const currentW3 = document.getElementById('selectTab').offsetHeight;
  const totalLength = currentW1 + currentW2 + currentW3;
  const yOffset = window.pageYOffset;
  const scrollUpButton = document.getElementById('scrollUpButton')
  if (yOffset > 1200) {
    scrollUpButton.style.opacity = '1';
    scrollUpButton.style.display = 'block';
  } else {
    scrollUpButton.style.opacity = '0';
    setTimeout(function () {
      scrollUpButton.style.display = 'none';
    }, 100);  }
	if (disableTimer && (yOffset >= totalLength - screenHeight - 100)) {
    disableTimer  = false;
    fillFriendsTab();
    setTimeout(function () {
      disableTimer  = true;
    }, 100);
  }
}
window.onscroll = yHandler;
