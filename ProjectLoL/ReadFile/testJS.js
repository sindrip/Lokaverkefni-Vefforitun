(function(){

  /****
  Hérna skerum við niður file-ana
  ****/
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
                  input.includes('EXITCODE') ||
                  input.includes('Spawning champion')||
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
    console.log(testDB);
  }
}());
