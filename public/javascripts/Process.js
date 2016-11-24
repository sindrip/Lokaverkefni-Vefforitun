'use strict';

// Starts process
function urvinnsla() {
  findPlayerID();
  fillModal();
}
// process after your summonere name has been found
function urvinnslaWithSummonerName() {
  apiCall();
  setTimeout(function (){
    document.getElementById('process').className = 'process hide';
    document.getElementById('display').className = 'display';
    document.getElementById('scrollUpButton').style.display = 'none';

  }, 1500);
}


// ===========================
// creates pop up to select your names
// bool array for summ names;
const selectedSummonerName = [];
function fillModal() {
  const listas = document.getElementById('myDropdown');
  for (let i = 0; i < yourSummonerName.length; i += 1) {
    selectedSummonerName[i] = true;
  }
  const modal = document.getElementById('modal-content');
  const uList = document.createElement('ul');
  uList.className = 'list-group';
  uList.setAttribute('id', 'summNameList');
  const itemHeader = document.createElement('li');
  itemHeader.appendChild(document.createTextNode('Select your summonernames. You can add more at the bottom, please note that they are case sensitive.'));
  itemHeader.className = 'summNameListHeader';
  uList.appendChild(itemHeader);
  let counter = 0;
  yourSummonerName.forEach((name) => {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(name));
    item.setAttribute('id', counter);
    item.className = 'list-group-item setItemGreen';
    uList.appendChild(item);
    counter += 1;
  });
  const itemText = document.createElement('input');
  itemText.setAttribute('type', 'text');
  itemText.setAttribute('placeholder', 'New name');
  itemText.setAttribute('type', 'text');
  itemText.setAttribute('id', 'summNameField');
  itemText.className = 'form-control addInputLook';
  const inputSummNameButton = document.createElement('button');
  inputSummNameButton.className = 'btn btn-success addButtonLook';
  inputSummNameButton.appendChild(document.createTextNode('Add summoner name'));
  inputSummNameButton.addEventListener('click', () => {
    const nameField = document.getElementById('summNameField');
    if (nameField.value) {
      const item = document.createElement('li');
      item.appendChild(document.createTextNode(nameField.value));
      item.setAttribute('id', selectedSummonerName.length);
      item.className = 'list-group-item setItemGreen';
      selectedSummonerName[selectedSummonerName.length] = true;
      uList.insertBefore(item, uList.lastChild.previousSibling);
      nameField.value = '';
    }
    setModalHeight();
  });
  uList.appendChild(itemText);
  uList.appendChild(inputSummNameButton);
  const summNameButton = document.createElement('button');
  summNameButton.className = 'btn btn-success col-xs-12 lockButtonLook';
  summNameButton.appendChild(document.createTextNode('Lock in'));
  summNameButton.addEventListener('click', () => {
    if (selectedSummonerName.every(elem => !elem)) {
    } else {
      yourSummonerName = [];
      for (let j = 0; j < selectedSummonerName.length; j += 1) {
        if (selectedSummonerName[j] === true) {
          yourSummonerName.push(document.getElementById(j).innerHTML);
        }
      }
      document.getElementById('myModal').style.display = 'none';
      urvinnslaWithSummonerName();
    }
  });
  setModalHeight();
  modal.insertBefore(uList, modal.lastChild.previousSibling);
  modal.insertBefore(summNameButton, modal.firstChild);
  document.getElementById('myModal').style.display = 'block';
  document.getElementById('summNameList').addEventListener('click', (e) => { summNameClicked(e); });
}
// dynamic height for modal, expands as more name come
function setModalHeight() {
  const setHeight = 40 + (selectedSummonerName.length * 5) + '%';
  document.getElementById('modal-content').style.height = setHeight;
}
// event for when a user selects names
function summNameClicked(event) {
  if (event.target && event.target.nodeName === 'LI' && event.target.id !== '') {
    selectedSummonerName[event.target.id] = !selectedSummonerName[event.target.id];
    if (selectedSummonerName[event.target.id]) {
      event.target.className = 'list-group-item setItemGreen';
    } else {
      event.target.className = 'list-group-item';
    }
  }
}
// ===========================

// ===========================
// calls info from api
function apiCall() {
  $.ajax({
    url: 'data',
    type: 'GET',
    dataType: 'json',
    cache: true,
    success: (json) => {
      jsonRiot = json.data;
      createChampionArray(json);
    },
    error: function(data, status, error2) {
    },
  });
}
// makes champion object from api result
function createChampionArray(championsJSON) {

  for (const key in championsJSON.data) {
    champions[key] = { numgames: 0 };
    aToZChamps.push(key);
  }
  aToZChamps.sort();
  putInfoIntoChampions(yourSummonerName);
}
// fills champions with info from filteredDB
function putInfoIntoChampions(yourNameInfo) {
  const tempe = [];
  filteredDB.forEach((arrayStak) => {
    const yourChampInfo = whatChampYouPlaying(arrayStak.players, yourNameInfo);
    if (yourChampInfo) {
      const yourChamp = yourChampInfo.champion;
      const numgames = champions[yourChamp].numgames;
      champions[yourChamp][numgames] = {
        date: arrayStak.date,
        patch: arrayStak.patch,
        skin: yourChampInfo.skin,
        team: yourChampInfo.team,
        gameTime: arrayStak.game_time,
        deaths: arrayStak.deaths.length,
        gameResult: arrayStak.game_result,
      };
      champions[yourChamp].numgames = numgames + 1;
      tempe.push(arrayStak);
    }
  });
  filteredDB = tempe;
  remakeUniquePlayer();
  // why did I do this again
  setTimeout(function (){
    vinnaFylki();

  }, 2000);
}
// remakes unique players after you selected summoner names
function remakeUniquePlayer(){
  playerIDArray = {};
  filteredDB.forEach((arrayStak) => {
    arrayStak.players.forEach((playerID) => {
      playerIDArray[playerID.summonername] = (playerIDArray[playerID.summonername] || 0) + 1;
    });
  });
}
// returns object that contains your summoner name from gameItem
function whatChampYouPlaying(playerArray, yourNameInfo) {
  let foundName = null;
  playerArray.forEach((arrayStak) => {
    yourNameInfo.forEach((innerArrayStak) => {
      if (arrayStak.summonername === innerArrayStak) {
        foundName = arrayStak;
      }
    });
  });
  return foundName;
}
// ===========================
// list of people that are not you
const notYourSummonerName = {};
// initializes algorithm that determines your summoner name
function findPlayerID() {
  filteredDB.forEach((arrayStak) => {
    arrayStak.players.forEach((playerID) => {
      playerIDArray[playerID.summonername] = (playerIDArray[playerID.summonername] || 0) + 1;
      if (!playerIDArrayWithWins[playerID.summonername]) {
        playerIDArrayWithWins[playerID.summonername] = { W: 0, L: 0 };
      }
    });
  });
  // finnur þín nöfn
  findSummonerNames(playerIDArray);
  // setur wins losses á playerIDArray fyrir gæja í þínu liði
  filteredDB.forEach((arrayStak) => {
    const whatTeamIsPlayer = findPlayerTeam(arrayStak);
    arrayStak.players.forEach((playerID) => {
      if (playerID.team === whatTeamIsPlayer) {
        playerIDArrayWithWins[playerID.summonername][arrayStak.game_result] += 1;
      }
    });
  });
}
// finds if red or blue side
function findPlayerTeam(arrayStak) {
  let tempTeam = 3;
  arrayStak.players.forEach((playerID) => {
    if (yourSummonerName.indexOf(playerID.summonername) !== -1) {
      tempTeam = playerID.team;
    }
  });
  return tempTeam;
}
// recursive function that fins summoner names
function findSummonerNames(summonersArray) {
  let tempfiltArray;
  if (Object.keys(summonersArray).length < 1) { return; }
  const topSummoner = findTopSummonerInArray(summonersArray);
  // hættir loopu að leita að other summoner names ef hæðsta nafn er með minna en 20 leiki
  if (summonersArray[topSummoner] > 15) {
    yourSummonerName.push(topSummoner);
    tempfiltArray = filterplayerIDArray();
    findSummonerNames(tempfiltArray);
  } else {
    return;
  }
}
// returns array that contains games without your current summoner names
function filterplayerIDArray() {
  const newplayerIDArray = {};
  filteredDB.forEach((arrayStak) => {
    let containsTopSummoner = false;
    arrayStak.players.forEach((playerID) => {
      if (yourSummonerName.indexOf(playerID.summonername) !== -1) {
        containsTopSummoner = true;
      }
    });
    if (!containsTopSummoner) {
      arrayStak.players.forEach((playerID) => {
        newplayerIDArray[playerID.summonername] =
        (newplayerIDArray[playerID.summonername] || 0) + 1;
      });
    } else {
      arrayStak.players.forEach((playerID) => {
        notYourSummonerName[playerID.summonername] = 0;
      });
    }
  });
  return newplayerIDArray;
}
// finds summoner name with most games
function findTopSummonerInArray(arrayObject) {
  const currentTopSummoner = [0, 0];
  for (const key in playerIDArray) {
    if (arrayObject[key] > currentTopSummoner[1]) {
      currentTopSummoner[0] = key;
      currentTopSummoner[1] = arrayObject[key];
    }
  }
  if (currentTopSummoner[0] in notYourSummonerName) {
    arrayObject[currentTopSummoner[0]] = 0;
    const tempName = findTopSummonerInArray(arrayObject);
    arrayObject[currentTopSummoner[0]] = currentTopSummoner[1];
    currentTopSummoner[0] = tempName;
  }
  return currentTopSummoner[0];
}
