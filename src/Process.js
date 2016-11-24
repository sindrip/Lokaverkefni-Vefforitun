// API lykillinn
const API_KEY = 'RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829';
// Aðalfallið, býr til millistigsfylkin
function urvinnsla() {
  // console.log(listas);
  // finnur your summonernames
  findPlayerID();
  // filters game sem eru ekki þínir
  // filteredDB = filterOutSummoner();
  // console.log('homo');
  // hér er filteredDB orðið hreint, þá búið að remova allt sem á ekki við
  // callar á RIOT API inn
  fillModal();
}
function urvinnslaWithSummonerName() {
  apiCall();
  // putInfoIntoChampions

  // ekki calla á display strax
  // fillChart('Hour', gameByHour);
  // document.getElementById('summonername').innerHTML = yourSummonerName;

  document.getElementById('process').className = 'process hide';
  document.getElementById('display').className = 'display';

  // console.log(filteredDB);
  // console.log(champions);
}

// ===========================
// býr til pop up til að velja sumname
// bool array fyrir summ names;
const selectedSummonerName = [];
function fillModal() {
  // dropdown menuinn
  const listas = document.getElementById('myDropdown');
  // nullstillir i false
  for (let i = 0; i < yourSummonerName.length; i += 1) {
    selectedSummonerName[i] = true;
  }
  const modal = document.getElementById('modal-content');
  const uList = document.createElement('ul');
  uList.className = 'list-group';
  uList.setAttribute('id', 'summNameList');
  for (const key in playerIDArray) {
    const ahref = document.createElement('a');
    let stringa = '#' + key;
    stringa = stringa.toLowerCase();
    // console.log(stringa);
    ahref.setAttribute('href', stringa);
    ahref.setAttribute('onclick', 'myFunction()');
    ahref.appendChild(document.createTextNode(key));
    listas.appendChild(ahref);
    ahref.addEventListener('click', (e) => {
      // console.log(e);
      // let nameField = document.getElementById('summNameField');
      const nameField = e.target.innerHTML;
      // console.log(nameField.value);
      const item = document.createElement('li');
      item.appendChild(document.createTextNode(nameField));
      item.setAttribute('id', selectedSummonerName.length);
      // console.log();
      item.className = 'list-group-item setItemGreen';
      selectedSummonerName[selectedSummonerName.length] = true;
      // uList.insertBefore(item, uList.lastChild);
      uList.appendChild(item);
      // console.log(selectedSummonerName);
      document.getElementById('myInput').value = '';
      filterFunction();
      setModalHeight();
    });
  }
  // gerir textann efst
  const itemHeader = document.createElement('li');
  itemHeader.appendChild(document.createTextNode('Select your summonernames. You can add more at the bottom, please note that they are case sensitive.'));
  itemHeader.className = 'summNameListHeader';
  uList.appendChild(itemHeader);
  // setur items í listann
  let counter = 0;
  yourSummonerName.forEach((name) => {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(name));
    item.setAttribute('id', counter);
    // item.setAttribute('onclick','MakeBold();');
    item.className = 'list-group-item setItemGreen';
    uList.appendChild(item);
    counter += 1;
  });
  // bætir við textbox
  const itemText = document.createElement('input');
  itemText.setAttribute('type', 'text');
  itemText.setAttribute('placeholder', 'New name');
  itemText.setAttribute('type', 'text');
  itemText.setAttribute('id', 'summNameField');
  itemText.className = 'form-control addInputLook';
  // submit takki fyrir textbox
  const inputSummNameButton = document.createElement('button');
  inputSummNameButton.className = 'btn btn-success addButtonLook';
  inputSummNameButton.appendChild(document.createTextNode('Add summoner name'));
  inputSummNameButton.addEventListener('click', () => {
    const nameField = document.getElementById('summNameField');
    // console.log(nameField.value);
    if (nameField.value) {
      const item = document.createElement('li');
      item.appendChild(document.createTextNode(nameField.value));
      item.setAttribute('id', selectedSummonerName.length);
      // console.log();
      item.className = 'list-group-item setItemGreen';
      selectedSummonerName[selectedSummonerName.length] = true;
      uList.insertBefore(item, uList.lastChild.previousSibling);
      nameField.value = '';
      // console.log(selectedSummonerName);
    }
  });
  function filterOutSummonerFixed() {
    let val = 0;
    // console.log(yourSummonerName);
    filteredDB.forEach((stak) => {
      let foundName = true;
      stak.players.forEach((player) => {
        // console.log(player.summonername);
        if (yourSummonerName.indexOf(player.summonername) !== -1) {
          foundName = false;
        }
      });
      // console.log(stak);
      if (foundName) {
        filteredDB.splice(val, 1);
      }
      // console.log(abc);
      // console.log('-----------------');
      val += 1;
    });
    // console.log(filteredDB);
    urvinnslaWithSummonerName();
  }
  // uList.appendChild(itemText);
  // uList.appendChild(inputSummNameButton);
  // bætir við takka
  const summNameButton = document.createElement('button');
  summNameButton.className = 'btn btn-success col-xs-12 lockButtonLook';
  summNameButton.appendChild(document.createTextNode('Lock in'));
  summNameButton.addEventListener('click', () => {
    // checkar ef allt er false
    if (selectedSummonerName.every(elem => !elem)) {
      // console.log('ekki ma allt vera false');
    } else {
      yourSummonerName = [];
      // console.log(selectedSummonerName);
      for (let j = 0; j < selectedSummonerName.length; j += 1) {
        if (selectedSummonerName[j] === true) {
          yourSummonerName.push(document.getElementById(j).innerHTML);
        }
        // console.log(your);
      }
      document.getElementById('myModal').style.display = 'none';
      filterOutSummonerFixed();
    }
    // console.log(yourSummonerName);
  });
  // modal.appendChild(uList);
  setModalHeight();
  // console.log(modal);
  modal.insertBefore(uList, modal.lastChild.previousSibling);
  modal.insertBefore(summNameButton, modal.firstChild);
  // gerir sýnilegt þegar búið að er finna summonername
  document.getElementById('myModal').style.display = 'block';
  document.getElementById('summNameList').addEventListener('click', (e) => { summNameClicked(e); });
}
function setModalHeight() {
  // console.log(selectedSummonerName.length);
  const setHeight = 55 + (selectedSummonerName.length * 4) + '%';
  document.getElementById('modal-content').style.height = setHeight;
}
// ///
function myFunction() {
  // console.log('boobooboboob');
  document.getElementById('myDropdown').classList.toggle('show');
}

function filterFunction() {
  // let input, filter, ul, li, a, i, div;
  const input = document.getElementById('myInput');
  const filter = input.value.toUpperCase();
  const div = document.getElementById('myDropdown');
  const a = div.getElementsByTagName('a');
  let i;
  for (i = 0; i < a.length; i += 1) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = '';
    } else {
      a[i].style.display = 'none';
    }
  }
}
// ///
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
// kallar á riot apiinn
function apiCall() {
  /*$.ajax({
    url: 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=' + API_KEY,
    // https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829
    type: 'GET',
    dataType: 'json',
    data: {
    },
    success: (json) => {
      // console.log(json);
      createChampionArray(json);
      console.log(infoAboutChampions('Zyra'));
      // set þetta hér því js er synchronus, hérna ætti allt að vera búið að koma
    },
    error: (XMLHttpRequest, textStatus, errorThrown) => {
      alert('error getting connecting to API');
      console.log(errorThrown);
    },
  });*/
  $.ajax({
    url: 'http:/localhost:3000/data',
    type: 'GET',
    dataType: 'json',
    cache: true,
    success: (json) => {
      // console.log(json);
      createChampionArray(json);
      console.log(infoAboutChampions('Zyra'));
      // set þetta hér því js er synchronus, hérna ætti allt að vera búið að koma
    },
    error: function(data, status, error) {
      console.log('error', data, status, error);
      let error = document.getElementById('loading')
      error.innerHTML = error;
    }
  });
}
// gerir objectið champions sem inniheldur alla champions
function createChampionArray(championsJSON) {
  // console.log(championsJSON.data.Aatrox.name);

  for (const key in championsJSON.data) {
    champions[key] = { numgames: 0 };
    // champions[key][numgames] = 1;
  }
  putInfoIntoChampions();
}
// keyrir í gegnum filteredDB og raðar info niður á champions objectið
function putInfoIntoChampions() {
  // let yourChamp;
  filteredDB.forEach((arrayStak) => {
    const yourChampInfo = whatChampYouPlaying(arrayStak.players);
    // console.log(yourChampInfo);
    if (yourChampInfo) {
      const yourChamp = yourChampInfo.champion;
      const numgames = champions[yourChamp].numgames;
      // console.log(yourChamp);
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
    } else {
      delete filteredDB.arrayStak;
    }
  });
  vinnaFylki();
}
// skilar því players array úr filteredDB sem hefur þitt nafn
function whatChampYouPlaying(playerArray) {
  let foundName = null;
  playerArray.forEach((arrayStak) => {
    // console.log(arrayStak);
    yourSummonerName.forEach((innerArrayStak) => {
      if (arrayStak.summonername === innerArrayStak) {
        // console.log(arrayStak.champion);
        foundName = arrayStak;
      }
    });
  });
  // console.log(foundName);
  return foundName;
}
// ===========================
// listi yfir alla players með wins
const playerIDArrayWithWins = {};
// listi yfir þá sem eru ekki þú
const notYourSummonerName = {};
// listar up alla players í leiknum í playerIDArray
function findPlayerID() {
  filteredDB.forEach((arrayStak) => {
    arrayStak.players.forEach((playerID) => {
      playerIDArray[playerID.summonername] = (playerIDArray[playerID.summonername] || 0) + 1;
      if (!playerIDArrayWithWins[playerID.summonername]) {
        playerIDArrayWithWins[playerID.summonername] = { W: 0, L: 0 };
      }
    });
  });
  // console.log(playerIDArrayWithWins);
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
  // console.log(playerIDArrayWithWins);
}
// finnur í hvaða side þú ert
function findPlayerTeam(arrayStak) {
  let tempTeam = 3;
  arrayStak.players.forEach((playerID) => {
    if (yourSummonerName.indexOf(playerID.summonername) !== -1) {
      tempTeam = playerID.team;
    }
  });
  return tempTeam;
}
// endurkvæmt fall sem finnur þín usernames
function findSummonerNames(summonersArray) {
  let tempfiltArray;
  if (Object.keys(summonersArray).length < 1) { return; }
  const topSummoner = findTopSummonerInArray(summonersArray);
  // hættir loopu að leita að other summoner names ef hæðsta nafn er með minna en 20 leiki
  if (summonersArray[topSummoner] > 15) {
    // console.log(yourSummonerName);
    yourSummonerName.push(topSummoner);
    tempfiltArray = filterplayerIDArray();
    findSummonerNames(tempfiltArray);
  } else {
    return;
  }
}
// skilar fylki sem inniheldur alla leiki sem eru án þinna nafna(sem hafa fundist)
function filterplayerIDArray() {
  console.time('finnaNafn');
  console.log('Hef leit að þínum nöfnum');
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
  console.timeEnd('finnaNafn');
  return newplayerIDArray;
}
// finnur top summonernamið, þá það sem kom oftast fyrir
function findTopSummonerInArray(arrayObject) {
  const currentTopSummoner = [0, 0];
  for (const key in playerIDArray) {
    if (arrayObject[key] > currentTopSummoner[1]) {
      currentTopSummoner[0] = key;
      currentTopSummoner[1] = arrayObject[key];
    }
  }
  // debugger;
  if (currentTopSummoner[0] in notYourSummonerName) {
    arrayObject[currentTopSummoner[0]] = 0;
    // debugger;
    const tempName = findTopSummonerInArray(arrayObject);
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

function infoAboutChampions(champion){
  const infoAboutChampion = {
    patches: {},
    totalDeaths: 0,
    totalGameTime: 0,
    B: {W: 0, L:0,},
    R: {W: 0, L:0},
    skins: {},
  }
  const numgames = champions[champion]['numgames'];
  if(numgames === 0) return infoAboutChampion;
  for (let i = 0; i < numgames; i++) {
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
