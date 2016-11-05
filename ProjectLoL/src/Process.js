
// API lykillinn
const API_KEY = 'RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829';

//gen info fylkið

let filteredDB = [];

//filteruðu föllinn, alltaf vinna með þessi


function urvinnsla() {
  Api_Call();
  findPlayerID();
  filteredDB = filterOutSummoner();
  // hér er filteredDB orðið hreint, þá búið að remova allt sem á ekki við
  //callar á RIOT API inn
  Api_Call();
  // ekki vinna
  // vinnaFylki();
  fillChart('Hour', gameByHour);
  document.getElementById('summonername').innerHTML = yourSummonerName;
}



function Api_Call() {
  $.ajax({
    url: 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=' + API_KEY,
    //    https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829
    type: 'GET',
    dataType: 'json',
    data: {
    },
    success: function (json) {
      console.log(json);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("error getting connecting to API");
    }
  });
}
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
//hvaða dag, viku ár etc... spilaru á
// listOfProperties heldur utan um hvað er búið að pusha inn í.
const gameByHour = {
  listOfProperties: [],
};
const gameByDay = {
  listOfProperties: [],
};
const gameByMonthDay = {
  listOfProperties: [],
};
const gameByMonth = {
  listOfProperties: [],
};
const gameByYear = {
  listOfProperties: [],
};
const gameByAll = {
  listOfProperties: [],
};
// listi yfir alla players
let playerIDArray = {};
// listi yfir þín summonername
let yourSummonerName = [];

function findPlayerID() {
  filteredDB.forEach(function (arrayStak) {
    arrayStak.players.forEach(function (playerID) {
        playerIDArray[playerID.summonername] = (playerIDArray[playerID.summonername] || 0) + 1;
    });
  });

  findSummonerNames(playerIDArray);
}

function findSummonerNames(summonersArray) {
  if(Object.keys(summonersArray).length < 1) { return;}
  // console.log(summonersArray);
  //console.log(summonersArray);
  let topSummoner = findTopSummonerInArray(summonersArray);
  // console.log(topSummoner);
  // debugger;
  //hættir loopu að leita að other summoner names ef hæðsta nafn er með minna en 20 leiki
  if(summonersArray[topSummoner] < 15) { return;} else {
    yourSummonerName.push(topSummoner)
    // console.log(yourSummonerName);
    var tempfiltArray = filterplayerIDArray(summonersArray);

    // console.log(tempfiltArray);
    // debugger;
    findSummonerNames(tempfiltArray);
  }
}

function filterplayerIDArray(summonersArray) {
  let newplayerIDArray = {};
  filteredDB.forEach(function (arrayStak) {
    //debugger;
    let containsTopSummoner = false;
    arrayStak.players.forEach(function (playerID) {
      if(yourSummonerName.indexOf(playerID.summonername) !== -1) {
        containsTopSummoner = true;
      }
    });
    //debugger;
    if(!containsTopSummoner) {
      arrayStak.players.forEach(function (playerID) {
        newplayerIDArray[playerID.summonername] = (newplayerIDArray[playerID.summonername] || 0) + 1;
      });
    }
    //debugger;
  });
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
  return currentTopSummoner[0];
}

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

//NOtkun: findIfContains(arrayElements, element)
//FYrir: arrayElements er fylki af stökum af sama tagi og element
//Gidli true eða false eftir því hvort það var þar eða ekki.
function findIfContains(arrayElements){
  arrayElements.forEach( function(arrayStak) {
    yourSummonerName.forEach( function(innerArrayStak) {
      if(arrayStak === innerArrayStak) return true;
    })
  })
  return false;
}

//Notkun: filterOutSummoner(arraygames, summoner);
//Fyrir: arraygames er stak af leikjum og summoner er nafn a summoner
//Gidli listi af leikjum an summoners
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
