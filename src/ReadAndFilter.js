const testDB = [];

let change = 0;
let stopdot = false;
function move() {
  if (stopdot) {
    return;
  }
  // console.log('homo');
  if (change === 0) {
    document.getElementById('loadingdots1').className = 'loadingdots hide';
    document.getElementById('loadingdots2').className = 'loadingdots hide';
    document.getElementById('loadingdots3').className = 'loadingdots hide';
    change = 1;
  } else if (change === 1) {
    document.getElementById('loadingdots1').className = 'loadingdots';
    change = 2;
  } else if (change === 2) {
    document.getElementById('loadingdots2').className = 'loadingdots';
    change = 3;
  } else {
    document.getElementById('loadingdots3').className = 'loadingdots';
    change = 0;
  }
  setTimeout(move, 1000);
}

// Bæta evenlistener á formið
document.getElementById('files').addEventListener('change', handleFileSelect, false);
// wat
console.time('fileScanner');
console.log('fileScanner started');
// Handler fyrir files

function handleFileSelect(evt) {
  console.log('a');
  const files = evt.target.files; //  FileList object
  console.log('b');
  console.timeEnd('fileScanner');
  dataMinify(files);
  // dataMinify(evt)
  // console.log(evt.target.files[0]);
}

function dataMinify(files) {
  // files is a FileList of File objects. List some properties.
  let numOfFiles = 0;
  let counter = 0;
  document.getElementById('input').className = 'input hide';
  document.getElementById('process').className = 'process';
  move();
  console.time('lestur');
  console.log('lestur hefst');
  // loopum i gegnum alla filea sem ad vid fengum
  for (let f; f = files[numOfFiles]; numOfFiles += 1) {
    const reader = new FileReader();

    //  thegar ad skjal er loadad keyrum adgerd
    reader.onload = () => {
      const text = reader.result;
      //  splittum a new line
      const textArray = text.split('\n');
      // console.log(textArray[0]);
      //  Saekjum thau gogn sem vid hofum ahuga a
      const reducedArray = textArray.filter(input =>
        (input.includes('GAMESTATE_GAMELOOP Begin') ||
                input.includes('"exit_code":"EXITCODE') ||
                input.includes('Spawning champion') ||
                input.includes('Build Version: Version') ||
                input.includes('The Killer was'))
      );

      //  sækjum dagsetningu, og þvingum hana fremst í array
      const dateIndex = textArray[0].indexOf('started at') + 11;
      const date = stringToDate(textArray[0].substring(dateIndex, dateIndex + 19));
      reducedArray.unshift(date);

      testDB.push(reducedArray);
      counter += 1;
      if (counter === numOfFiles) {
        console.timeEnd('lestur');
        procTest();
      }
    };
    reader.readAsText(f);
  }
}

//  Formatta streng og typecast yfir a date format
function stringToDate(stringDate) {
  // const stringDate = ;
  return new Date(stringDate.replace('T', ' ').replace(/-/g, '/'));
}

/**
Hérna hefst keyrsla á úrvinnslufallinu
**/

function procTest() {
  console.time('vinnslutimer');
  console.log('vinnsla hefst');
  testDB.forEach((textFile) => {
    // býr til infofylkið
    try {
      const infoArray = {
        date: textFile.shift(),
        patch: null,
        players: [],
        bot_count: 0,
        loading_time: null,
        game_time: null,
        deaths: [],
        game_result: null,
      };
      // infoArray.patch
      const patchLine = textFile.shift();
      const patchStart = patchLine.substring(patchLine.indexOf('Build Version: Version') + 23);
      const patchString = patchStart.substring(0, patchStart.indexOf('.', 3));
      const patchSplit = patchString.split('.');
      infoArray.patch = patchString;
      // if patch less then 3.10 throw away
      if (patchSplit[0] > 3 || (patchSplit[0] === 3 || patchSplit[1] > 9)) {
        // infoArray.game_time && infoArray.game_result
        const gameEndLine = textFile.filter(input =>
          input.includes('"exit_code":"EXITCODE')
        )[0];
        // infoArray.game_result
        const gameResultCarNr = gameEndLine.indexOf('"Game exited","exit_code":"');
        infoArray.game_result = gameEndLine.substring(gameResultCarNr + 36, gameResultCarNr + 37);
        // if abandoned game, throw away
        if (infoArray.game_result !== 'A') {
          // infoArray.players
          const summonerArray = textFile.filter(input =>
            input.includes('Spawning champion')
          );
          summonerArray.forEach((itemIn) => {
            let item = itemIn;
            const tempChamp = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
            item = item.substring(item.indexOf(')') + 1);
            const tempSkin = item.substring(item.indexOf('skinID') + 7, item.indexOf('skinID') + 8);
            const tempTeam = item.substring(item.indexOf('team') + 5, item.indexOf('team') + 6);
            const tempName = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
            item = item.substring(item.indexOf(')') + 1);
            const tempType = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
            if (tempType === 'is BOT AI') {
              infoArray.bot_count += 1;
            } else {
              const playerArray = {
                // k
                champion: null,
                skin: null,
                team: null,
                summonername: null,
                playertype: null,
              };
              playerArray.champion = tempChamp;
              playerArray.skin = tempSkin;
              playerArray.team = tempTeam;
              playerArray.summonername = tempName;
              playerArray.playertype = tempType;
              if (infoArray.players.length < 11) {
                infoArray.players.push(playerArray);
              }
            }
          });
          // infoArray.loading_time
          infoArray.loading_time = textFile.filter(input =>
            input.includes('GAMESTATE_GAMELOOP Begin')
          )[0].substring(0, 10) - 0;
          // infoArray.game_time
          infoArray.game_time = gameEndLine.substring(0, 10) - infoArray.loading_time;
          // infoArray.deaths
          const deathArray = textFile.filter(input =>
            input.includes('The Killer was')
          );
          deathArray.forEach((item) => {
            const deathTime = item.substring(0, 10) - infoArray.loading_time;
            infoArray.deaths.push(deathTime);
          });
          filteredDB.push(infoArray);
        } else {
          console.log('abandoned game, not used');
        }
      } else {
        console.log('file to old');
      }
    } catch (err) {
      console.log('error');
    }
  });
  console.timeEnd('vinnslutimer');
  stopdot = true;
  urvinnsla();
}
