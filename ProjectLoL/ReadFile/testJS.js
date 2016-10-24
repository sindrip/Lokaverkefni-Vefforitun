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
          input.includes('Expression: ALE')||input.includes('Data Error message'));}
        ).filter(function (input2) {
          if(input2.length > 2) {
            return input2;
          }
        });

        // test fall a medhondlun gagna
        for (var j = 0; j < reducedArray.length; j++) {
        }
      }
      reader.readAsText(f);
   }

   // no. files chosen sem kemur
   document.getElementById('output-html').innerHTML = '<ul>' + output.join('') + '</ul>';
 }


}());
