(function(){

  let testDB = [];

  // Bæta evenlistener á formið
  document.getElementById('files').addEventListener('change', handleFileSelect, false);

  // Handler fyrir files
  function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    let output = [];

    // loopum i gegnum alla filea sem ad vid fengum
    for (var i = 0, f; f = files[i]; i++) {
      let reader = new FileReader();

      // thegar ad skjal er loadad keyrum adgerd
      reader.onload = function() {
        let text = reader.result;

        // splittum a new line og hendum otharfa linum
        let textArray = text.split('\n');
        var reducedArray = textArray.filter(function (input) {
          return !(input.includes('WARN')||input.includes('ERROR')||
          input.includes('Expression: ALE')||input.includes('Data Error message'))
          && input.length > 2;}
        );

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
        }
        testDB.push(oneTestDbInstance);
      }
      reader.readAsText(f);
   }
   console.log(testDB);

   // veit ekki
  document.getElementById('output-html').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

}());
