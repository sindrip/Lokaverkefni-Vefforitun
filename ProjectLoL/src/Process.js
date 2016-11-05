console.log('ja');
let filteredDB = [];
function urvinnsla() {
  findPlayerID();
  vinnaFylki();
  let player = findTopSummonerInArray(filteredDB);
  console.log(filterOutSummoner(filteredDB, player));
  fillChart('Hour', gameByHour);
  document.getElementById('summonername').innerHTML = yourSummonerName;
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

//NOtkun: findElement(arrayElements, element)
//FYrir: arrayElements er fylki af stökum af sama tagi og element
//Gidli true eða false eftir því hvort það var þar eða ekki.
function findElement(arrayElements, element){
  let i = 0;
  while(i <= arrayElements.length){
    if(arrayElements[i] === element) return true;
    i += 1;
  }
  return false;
}

//Notkun: filterOutSummoner(arraygames, summoner);
//Fyrir: arraygames er stak af leikjum og summoner er nafn a summoner
//Gidli listi af leikjum an summoners
function filterOutSummoner(arraygames, summoner){
  let i = 0;
  let filteredOut = [];
  while(i < arraygames.length){
    let players = arraygames[i].players;
    let playersPivot = 0;

    let summoners = [];
    while(playersPivot < players.length){
      summoners.push(players[playersPivot].summonername);
      playersPivot += 1;
    }
    if(findElement(summoners, summoner)){
      filteredOut.push(arraygames[i]);
    }
    i += 1;
  }
  return filteredOut;
}
