document.getElementById('graph').style.visibility = "hidden";
document.getElementById("hourButton").addEventListener("click", function() {
  fillChart('Hour', gameByHour, null);
});
document.getElementById("dayButton").addEventListener("click", function() {
  fillChart('Day', gameByDay, weekday);
});
document.getElementById("monthDayButton").addEventListener("click", function() {
  fillChart('MonthDay', gameByMonthDay, null);
});
document.getElementById("monthButton").addEventListener("click", function() {
  fillChart('Month', gameByMonth, month);
});
document.getElementById("yearButton").addEventListener("click", function() {
  fillChart('Year', gameByYear, null);
});
document.getElementById("allButton").addEventListener("click", function() {
  fillChart('All', gameByAll, 'year');
});

let weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

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

function vinnaFylki() {
  console.log('poop');
  // fyrir hvert stak, arrayStak, í fylkinu filteredDB
  filteredDB.forEach(function (arrayStak) {
    //fyrir hvern death hvern death
    arrayStak.deaths.forEach(function (deathStak) {
      const deathToMinute = formatTime(deathStak)[1];
      if(!deathAtMinute[deathToMinute])
        deathAtMinute[deathToMinute] = 0;
      ++deathAtMinute[deathToMinute];
    });
    //finnur gildi fyrir death_and_gameLength_and_result
    const deathToLength = [arrayStak.deaths.length, arrayStak.game_time, arrayStak.game_result];
    death_and_gameLength_and_result.push(deathToLength)
    // finnur gildi í loadingTime og playTime
    loadingTime += arrayStak.loading_time;
    playTime += arrayStak.game_time;
    winsLosses[arrayStak.game_result] += 1;
    //
    gameBy(arrayStak.date);
  });
}

// hleður inn í gameByX
// feel free að endurskrifa ef finnið betri leið, forljótt
function gameBy(date) {
  if(!gameByHour[date.getHours()]) {
    gameByHour[date.getHours()] = 0;
    gameByHour.listOfProperties.push(date.getHours());
  }
  ++gameByHour[date.getHours()];

  if(!gameByDay[date.getDay()]){
    gameByDay[date.getDay()] = 0;
    gameByDay.listOfProperties.push(date.getDay());
  }
  ++gameByDay[date.getDay()];

  if(!gameByMonthDay[date.getDate()]){
    gameByMonthDay[date.getDate()] = 0;}
    gameByMonthDay.listOfProperties.push(date.getDate());
  ++gameByMonthDay[date.getDate()];

  if(!gameByMonth[date.getMonth()]){
    gameByMonth[date.getMonth()] = 0;
    gameByMonth.listOfProperties.push(date.getMonth());
  }
  ++gameByMonth[date.getMonth()];

  if(!gameByYear[date.getFullYear()]){
    gameByYear[date.getFullYear()] = 0;
    gameByYear.listOfProperties.push(date.getFullYear());
  }
  ++gameByYear[date.getFullYear()];

  const tempFullDate = [date.getDate(), date.getMonth(), date.getFullYear()];
  if(!gameByAll[tempFullDate]){
    gameByAll[tempFullDate] = 0;
    gameByAll.listOfProperties.push(tempFullDate);
  }
  ++gameByAll[tempFullDate];
}

// breytir sekúndum í formatið [hh, mm, ss]
function formatTime(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - hour * 3600) / 60);
  const second = seconds % 60;
  return [hour, minute, second];
}

// GRAPH FUNCTION
function fillChart(value, whatArray, axisChanger) {

  // console.log(value);
  var array1 = [[value, value]];
  // console.log(array1);
  var array2 = formatDataForChart(whatArray, axisChanger);
  var array3 = array1.concat(array2);
  XXX = array3;
  // console.log(XXX);
  document.getElementById('graph').style.visibility = "visible";
  drawChart1(value);
}

var XXX = [];
//function fillChart() {
//formatDataForChart(gameByHour,);
//google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart1);
function drawChart1(value) {
  //var data = google.visualization.arrayToDataTable(['Hour', 'Amount'].unshift(formatDataForChart(gameByHour)));
  var data = google.visualization.arrayToDataTable(XXX);

  var options = {
    title: 'Hvenar loadar in-game by:',
    hAxis: {title: value, titleTextStyle: {color: 'red'}}
    //vAxis: {title: 'Fjöldi', titleTextStyle: {color: 'red'}}
  };
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'));
  chart.draw(data, options);
}
//formatar fylki með 2 stökum þannig hægt er að nota google charts með því
function formatDataForChart(whatArray, axisChanger){
  const dataItemSetArray = [];
  whatArray.listOfProperties.forEach(function (dateItem) {
    let dataItemSetArrayItem;
    //console.log(dateItem);
    if(axisChanger === 'year') {
      var stringTime = dateItem[0] + '.' + month[dateItem[1]] + '.' + dateItem[2];
      dataItemSetArrayItem = [stringTime, whatArray[dateItem]];
    } else if(axisChanger) {
      dataItemSetArrayItem = [axisChanger[dateItem], whatArray[dateItem]];
    } else {
      dataItemSetArrayItem = [dateItem, whatArray[dateItem]];
    }

    dataItemSetArray.push(dataItemSetArrayItem);
  });
  return dataItemSetArray;
}

$(window).resize(function(){
  drawChart1();
});
