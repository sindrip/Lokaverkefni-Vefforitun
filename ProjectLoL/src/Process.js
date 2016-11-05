const API_KEY = 'RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829';
console.log('ja');
function urvinnsla() {
  Api_Call();
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
