'use strict';

/* eslint linebreak-style: ["error", "windows"]*/
(function () {

  /****
  Hérna skerum við niður file-ana
  ****/
  /*
  Viljum hafa eftirfarandi uppsetningu á filteredDb arrayinu:
  [
    0: date
    1: patch
    2: players
      [
        0: champion
        1: skin
        2: team
        3: summonername
        4: playertype
      ]
    3: bot_count;
    4: loading_time(game start)
    5: game_time(gameEnd - gameStart)
    6: deaths
      [
        0: time_of_death0 - gameStart
        .
        .
        N: time_of_deathN - gameStart
      ]
    6: game_result
  ]
  */
  var filteredDB = [];
  var testDB = [];

  //  Bæta evenlistener á formið
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  console.time('fileScanner');
  console.log('fileScanner started');
  //  Handler fyrir files
  function handleFileSelect(evt) {
    var files = evt.target.files; //  FileList object
    console.timeEnd('fileScanner');
    dataMinify(files);
  }

  function dataMinify(files) {
    //  files is a FileList of File objects. List some properties.
    var numOfFiles = 0;
    var counter = 0;
    console.time('lestur');
    console.log('lestur hefst');
    //  loopum i gegnum alla filea sem ad vid fengum

    var _loop = function _loop(f) {
      var reader = new FileReader();

      //  thegar ad skjal er loadad keyrum adgerd
      reader.onload = function () {
        var text = reader.result;
        //  splittum a new line
        var textArray = text.split('\n');

        //  Saekjum thau gogn sem vid hofum ahuga a
        var reducedArray = textArray.filter(function (input) {
          return input.includes('GAMESTATE_GAMELOOP Begin') || input.includes('"exit_code":"EXITCODE') || input.includes('Spawning champion') || input.includes('Build Version: Version') || input.includes('The Killer was');
        });

        //  sækjum dagsetningu, og þvingum hana fremst í array
        var dateIndex = textArray[0].indexOf('started at') + 11;
        var date = stringToDate(textArray[0].substring(dateIndex, dateIndex + 19));
        reducedArray.unshift(date);

        testDB.push(reducedArray);
        counter += 1;
        /*if (counter % 20 === 0) {
            console.log('yo, we at file nr: ' + counter);
        }*/
        if (counter === numOfFiles) {
          console.timeEnd('lestur');
          procTest();
        }
      };
      reader.readAsText(f);
    };

    for (var f; f = files[numOfFiles]; numOfFiles += 1) {
      _loop(f);
    }
  }

  //  Formatta streng og typecast yfir a date format
  function stringToDate(stringDate) {
    stringDate = stringDate.replace('T', ' ').replace(/-/g, '/');
    return new Date(stringDate);
  }

  /**
  Hérna hefst keyrsla á úrvinnslufallinu
  **/

  function procTest() {
    console.time('vinnslutimer');
    console.log('vinnsla hefst');
    testDB.forEach(function (textFile) {
      // býr til infofylkið
      try {
        (function () {
          var infoArray = {
            date: textFile.shift(),
            patch: null,
            players: [],
            bot_count: 0,
            loading_time: null,
            game_time: null,
            deaths: [],
            game_result: null
          };
          // infoArray.patch
          var patchLine = textFile.shift();
          var patchStart = patchLine.substring(patchLine.indexOf('Build Version: Version') + 23);
          var patchString = patchStart.substring(0, patchStart.indexOf('.', 3));
          var patchSplit = patchString.split('.');
          infoArray.patch = patchString - 0;
          // console.log(patchSplit);
          if (patchSplit[0] > 3 || patchSplit[0] === 3 || patchSplit[1] > 9) {
            // infoArray.players
            var summonerArray = textFile.filter(function (input) {
              return input.includes('Spawning champion');
            });
            summonerArray.forEach(function (item) {
              var tempChamp = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
              item = item.substring(item.indexOf(')') + 1);
              var tempSkin = item.substring(item.indexOf('skinID') + 7, item.indexOf('skinID') + 8);
              var tempTeam = item.substring(item.indexOf('team') + 5, item.indexOf('team') + 6);
              var tempName = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
              item = item.substring(item.indexOf(')') + 1);
              var tempType = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
              if (tempType === 'is BOT AI') {
                infoArray.bot_count += 1;
              } else {
                var playerArray = {
                  // k
                  champion: null,
                  skin: null,
                  team: null,
                  summonername: null,
                  playertype: null
                };
                playerArray.champion = tempChamp;
                playerArray.skin = tempSkin;
                playerArray.team = tempTeam;
                playerArray.summonername = tempName;
                playerArray.playertype = tempType;
                infoArray.players.push(playerArray);
              }
            });

            // infoArray.loading_time
            infoArray.loading_time = textFile.filter(function (input) {
              return input.includes('GAMESTATE_GAMELOOP Begin');
            })[0].substring(0, 10) - 0;

            // infoArray.game_time && infoArray.game_result
            var gameEndLine = textFile.filter(function (input) {
              return input.includes('"exit_code":"EXITCODE');
            })[0];
            // infoArray.game_time
            infoArray.game_time = gameEndLine.substring(0, 10) - infoArray.loading_time;
            // infoArray.game_result
            var gameResultCarNr = gameEndLine.indexOf('"Game exited","exit_code":"');

            infoArray.game_result = gameEndLine.substring(gameResultCarNr + 36, gameResultCarNr + 37);

            // infoArray.deaths
            var deathArray = textFile.filter(function (input) {
              return input.includes('The Killer was');
            });
            deathArray.forEach(function (item) {
              var deathTime = item.substring(0, 10) - infoArray.loading_time;
              infoArray.deaths.push(deathTime);
            });
            filteredDB.push(infoArray);
          } else {
            console.log('file to old');
          }
        })();
      } catch (err) {
        console.log('error');
      }
    });
    console.log(filteredDB);
    console.timeEnd('vinnslutimer');
  }
})();