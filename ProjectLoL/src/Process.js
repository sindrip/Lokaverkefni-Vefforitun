// API lykillinn
const API_KEY = 'RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829';
// Inniheldur heildarupplýsingar um alla leiki með þér
let filteredDB = [];
// Búið að flokka leikina eftir champions
let champions = {};
// listi yfir þín summonername
let yourSummonerName = [];
// Aðalfallið, býr til millistigsfylkin
function urvinnsla() {
  // finnur your summonernames
  findPlayerID();
  // filters game sem eru ekki þínir
  filteredDB = filterOutSummoner();
  // hér er filteredDB orðið hreint, þá búið að remova allt sem á ekki við
  //callar á RIOT API inn
  Api_Call();
  // putInfoIntoChampions

  // ekki calla á display strax
  // vinnaFylki();
  fillChart('Hour', gameByHour);
  document.getElementById('summonername').innerHTML = yourSummonerName;
}

// ===========================
// Notkun: findIfContains(arrayElements, element)
// Fyrir: arrayElements er fylki af stökum af sama tagi og element
// Gidli true eða false eftir því hvort það var þar eða ekki.
function findIfContains(arrayElements){
  arrayElements.forEach( function(arrayStak) {
    yourSummonerName.forEach( function(innerArrayStak) {
      if(arrayStak === innerArrayStak) return true;
    })
  })
  return false;
}
// Notkun: filterOutSummoner(arraygames, summoner);
// Fyrir: arraygames er stak af leikjum og summoner er nafn a summoner
// Gidli listi af leikjum an summoners
function filterOutSummoner(){
  let i = 0;
  let filteredOut = [];
  while(i < filteredDB.length){
    let players = filteredDB[i].players;
    let playersPivot = 0;

    let summoners = [];
    while(playersPivot < players.length){
      summoners.push(players[playersPivot].summonername);
      playersPivot += 1;
    }
    if(!findIfContains(summoners)){
      filteredOut.push(filteredDB[i]);
    }
    i += 1;
  }
  return filteredOut;
}
// ===========================

// ===========================
// kallar á riot apiinn
function Api_Call() {
  $.ajax({
    url: 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=' + API_KEY,
    //    https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829
    type: 'GET',
    dataType: 'json',
    data: {
    },
    success: function (json) {
      // console.log(json);
      createChampionArray(json);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("error getting connecting to API");
    }
  });
}
// gerir objectið champions sem inniheldur alla champions
function createChampionArray(championsJSON) {
  // console.log(championsJSON.data.Aatrox.name);

  for (var key in championsJSON.data) {

    champions[key] = {numgames:0,};
    // champions[key][numgames] = 1;
  }
  putInfoIntoChampions();
}
// keyrir í gegnum filteredDB og raðar info niður á champions objectið
function putInfoIntoChampions() {
  filteredDB.forEach(function (arrayStak) {
    var yourChampInfo = whatChampYouPlaying(arrayStak.players);
    if(yourChampInfo) {
      let yourChamp = yourChampInfo.champion;
      const numgames = champions[yourChamp]['numgames'];
      //console.log(yourChamp);
      champions[yourChamp][numgames] = {
        date: arrayStak.date,
        patch: arrayStak.patch,
        skin: yourChampInfo.skin,
        team: yourChampInfo.team,
        gameTime: arrayStak.game_time,
        deaths: arrayStak.deaths.length,
        gameResult: arrayStak.game_result,
      };
      champions[yourChamp]['numgames'] = numgames + 1;

    }
  });
  // console.log(champions);
}
//skilar því players array úr filteredDB sem hefur þitt nafn
function whatChampYouPlaying(playerArray) {
  let foundName = null;
  playerArray.forEach( function(arrayStak) {
    // console.log(arrayStak);
    yourSummonerName.forEach( function(innerArrayStak) {
      if(arrayStak.summonername === innerArrayStak) {
        // console.log(arrayStak.champion);
        foundName = arrayStak;
      }
    });
  });
  return foundName;
}
// ===========================

const deathAtMinute = {};
// array sem geymir death og gamelength saman
const death_and_gameLength_and_result = [];
// geymir total load time
let loadingTime = 0;
// geymir total play time
let playTime = 0;
// geymir wins og losses
const winsLosses = {
  W: 0,
  L: 0,
};

// ===========================
// listi yfir alla players með wins
let playerIDArrayWithWins = {};
// listi yfir alla players
let playerIDArray = {};
// listi yfir þá sem eru ekki þú
let notYourSummonerName = {};
// listar up alla players í leiknum í playerIDArray
function findPlayerID() {
  filteredDB.forEach(function (arrayStak) {
    arrayStak.players.forEach(function (playerID) {
      playerIDArray[playerID.summonername] = (playerIDArray[playerID.summonername] || 0) + 1;
      if(!playerIDArrayWithWins[playerID.summonername]){playerIDArrayWithWins[playerID.summonername] = {W:0,L:0};}
    });
  });
  // console.log(playerIDArrayWithWins);
  // finnur þín nöfn
  findSummonerNames(playerIDArray);
  // setur wins losses á playerIDArray fyrir gæja í þínu liði
  filteredDB.forEach(function (arrayStak) {
    let whatTeamIsPlayer = findPlayerTeam(arrayStak)
    arrayStak.players.forEach(function (playerID) {
      if(playerID.team === whatTeamIsPlayer) {
        playerIDArrayWithWins[playerID.summonername][arrayStak.game_result] += 1;
      }
    });
  });
  // console.log(playerIDArrayWithWins);
}
// finnur í hvaða side þú ert
function findPlayerTeam(arrayStak) {
  let tempTeam = 3
  arrayStak.players.forEach(function (playerID) {
    if(yourSummonerName.indexOf(playerID.summonername) !== -1) {
      tempTeam = playerID.team;
    }
  });
  return tempTeam;
}
// endurkvæmt fall sem finnur þín usernames
function findSummonerNames(summonersArray) {
  if(Object.keys(summonersArray).length < 1) { return;}
  let topSummoner = findTopSummonerInArray(summonersArray);
  //hættir loopu að leita að other summoner names ef hæðsta nafn er með minna en 20 leiki
  if(summonersArray[topSummoner] < 15) {
    // console.log(yourSummonerName);
    return;} else {
    yourSummonerName.push(topSummoner)
    var tempfiltArray = filterplayerIDArray(summonersArray);
    findSummonerNames(tempfiltArray);
  }
}
// skilar fylki sem inniheldur alla leiki sem eru án þinna nafna(sem hafa fundist)
function filterplayerIDArray(summonersArray) {
  console.time('finnaNafn');
  console.log('Hef leit að þínum nöfnum');
  let newplayerIDArray = {};
  filteredDB.forEach(function (arrayStak) {
    let containsTopSummoner = false;
    arrayStak.players.forEach(function (playerID) {
      if(yourSummonerName.indexOf(playerID.summonername) !== -1) {
        containsTopSummoner = true;
      }
    });
    if(!containsTopSummoner) {
      arrayStak.players.forEach(function (playerID) {
        newplayerIDArray[playerID.summonername] = (newplayerIDArray[playerID.summonername] || 0) + 1;
      });
    } else {
      arrayStak.players.forEach(function (playerID) {
        notYourSummonerName[playerID.summonername] = 0;
      });
    }
  });
  console.timeEnd('finnaNafn');
  return newplayerIDArray;
}
// finnur top summonernamið, þá það sem kom oftast fyrir
function findTopSummonerInArray(arrayObject) {
  const currentTopSummoner = [0,0];
  for(var key in playerIDArray ) {
    if(arrayObject[key] > currentTopSummoner[1]) {
      currentTopSummoner[0] = key;
      currentTopSummoner[1] = arrayObject[key]
    }
  }
  // debugger;
  if(currentTopSummoner[0] in notYourSummonerName)
  {
    arrayObject[currentTopSummoner[0]] = 0;
    // debugger;
    let tempName = findTopSummonerInArray(arrayObject);
    // debugger;
    arrayObject[currentTopSummoner[0]] = currentTopSummoner[1];
    currentTopSummoner[0] = tempName;
    // debugger;
  }
  // debugger;
  return currentTopSummoner[0];
}
// ===========================



//Fylki sem heldur utan um niðurstöðu leikja eftir ðatch.
let Process_patchwinrateArray = [];

//Notkun Process_WinRateDuringPatch(patch);
//Fyrir: Patch er númerið á þeim patch sem þú ert aðleita að. GamesOnPatchArray
// er fylki sem hefur eiginleikanna patch og winrate.
//Gildi: Fylki sem gefur upp alla wins og losses á viðkomandi patch fyrir viðkomndi fylki leikja
function Process_WinRateDuringPatch(GamesOnPatchArray,patch){
  let i = 0;
  let thisPatchWinrate = [];
  while(i < GamesOnPatchArray.length){
    //ítrar í gegnum alla leikina sem viðkomandi valdi og telur upp leikina
    //Á þeim patch
    if(GamesOnPatchArray[i].patch === patch){
      let result = filteredDB[i].game_result;
      if(result === "W"){
        thisPatchWinrate.push(1);
      }
      else{
        thisPatchWinrate.push(0);
      }
    }
    i += 1;
  }
  return thisPatchWinrate;
}
