(function(){

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
  let filteredDB = [];
  let testDB = [];

  // Bæta evenlistener á formið
  document.getElementById('files').addEventListener('change', handleFileSelect, false);

  function testProcessor(testData) {
    // object til ad geyma gogn um leik
    let oneTestDbInstance = {
      date: "",
      loadingTime: "",
      endTime: "",
      winLoss: "",
      summonersChamps: [],
    };

    // test fall a medhondlun gagna
    let dateIndex = reducedArray[0].indexOf("started at") + 11;
    oneTestDbInstance.date = reducedArray[0].substring(dateIndex, dateIndex+10);
    for (let j = 0; j < reducedArray.length; j++) {
      if (reducedArray[j].includes("GAMESTATE_GAMELOOP Begin")) {
        let data = reducedArray[j].substring(0,10);
        oneTestDbInstance.loadingTime = data;
      }

      if (reducedArray[j].includes("EXITCODE")) {
        let data = reducedArray[j].substring(0,10);
        oneTestDbInstance.endTime = data;

        let indexResult = reducedArray[j].indexOf("EXITCODE") + 9;
        data = reducedArray[j].substring(indexResult, indexResult+4);
        oneTestDbInstance.winLoss = data;
      }

      if (reducedArray[j].includes("created for")) {
        console.log("created for");
        let data = reducedArray[j];
        oneTestDbInstance.summonersChamps.push(data);
      }

      if (reducedArray.length - 1 === j) {
        testDB.push(oneTestDbInstance);
        console.log(testDB);
        console.log("test");
      }
    }

  }

  // Handler fyrir files
  function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object

    dataMinify(files);
  }

  function dataMinify(files) {
    // files is a FileList of File objects. List some properties.
    let numOfFiles = 0;
    let counter = 0;

    // loopum i gegnum alla filea sem ad vid fengum
    for (let f; f = files[numOfFiles]; numOfFiles++) {
      let reader = new FileReader();

      // thegar ad skjal er loadad keyrum adgerd
      reader.onload = function() {
        let text = reader.result;

        // splittum a new line
        let textArray = text.split('\n');

        // Saekjum thau gogn sem vid hofum ahuga a
        var reducedArray = textArray.filter(function (input) {
          return (input.includes('GAMESTATE_GAMELOOP Begin') ||
                  input.includes('"exit_code":"EXITCODE') ||
                  input.includes('Spawning champion')||
                  input.includes('Build Version: Version')||
                  input.includes('The Killer was'));
        });

        // sækjum dagsetningu, og þvingum hana fremst í array
        let dateIndex = textArray[0].indexOf("started at") + 11;
        let date = stringToDate(textArray[0].substring(dateIndex, dateIndex+19));
        reducedArray.unshift(date);

        testDB.push(reducedArray);
        counter++;
        if (counter === numOfFiles) {
          procTest();
        }
      }
      reader.readAsText(f);
    }
  }

  // Formatta streng og typecast yfir a date format
  function stringToDate(stringDate) {
    stringDate = stringDate.replace('T', ' ').replace(/-/g,'/');
        return new Date(stringDate);
  }

  /****
  Hérna hefst keyrsla á úrvinnslufallinu
  ****/

  function procTest() {
    //býr til infofylkið
    let infoArray = {
      date: testDB[0].shift(),
      patch: null,
      players: [],
      bot_count: 0,
      loading_time: null,
      game_time: null,
      deaths: [],
      game_result: null,
    }
    //infoArray.patch
    let patchLine = testDB[0].shift();
    let patchStart = patchLine.substring(patchLine.indexOf('Build Version: Version')+23);
    infoArray.patch = patchStart.substring(0, patchStart.indexOf('.', 3));

    //infoArray.players
    let summonerArray = testDB[0].filter(function (input) {
      return (input.includes('Spawning champion'));
    });
    summonerArray.forEach(function(item){
      var tempChamp = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
      item = item.substring(item.indexOf(')')+1);
      var tempSkin = item.substring(item.indexOf('skinID') + 7, item.indexOf('skinID') + 8);
      var tempTeam = item.substring(item.indexOf('team') + 5, item.indexOf('team') + 6);
      var tempName = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
      item = item.substring(item.indexOf(')')+1);
      var tempType = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
      if(tempType == 'is BOT AI'){
        infoArray.bot_count++;
      } else {
        playerArray = {
          champion: null,
          skin: null,
          team: null,
          summonername: null,
          playertype: null,
        }
        playerArray.champion = tempChamp;
        playerArray.skin = tempSkin;
        playerArray.team = tempTeam;
        playerArray.summonername = tempName;
        playerArray.playertype = tempType;
        infoArray.players.push(playerArray);
      }
    });

    //infoArray.loading_time
    infoArray.loading_time = testDB[0].filter(function (input) {
      return (input.includes('GAMESTATE_GAMELOOP Begin'));
    })[0].substring(0, 10)- 0;

    //infoArray.game_time && infoArray.game_result
    let gameEndLine = testDB[0].filter(function (input) {
      return (input.includes('"exit_code":"EXITCODE'));
    })[0];
    //infoArray.game_time
    infoArray.game_time = gameEndLine.substring(0, 10) - infoArray.loading_time;
    //infoArray.game_result
    var gameResultCarNr = gameEndLine.indexOf('"Game exited","exit_code":"');
    infoArray.game_result = gameEndLine.substring(gameResultCarNr + 36, gameResultCarNr + 37);

    //infoArray.deaths
    let deathArray = testDB[0].filter(function (input) {
      return (input.includes('The Killer was'));
    });
    deathArray.forEach(function(item){
      var deathTime = item.substring(0, 10) - infoArray.loading_time;
      infoArray.deaths.push(deathTime);
    });
    console.log(infoArray);
  }
}());
