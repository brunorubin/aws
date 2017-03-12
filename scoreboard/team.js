var API_ENDPOINT="https://api.<DOMAIN>/team/"

function grabDetails(queryStrings){
	team_id = queryStrings['tid']

	// AJAX call to hit API
	$.ajax({
		url: API_ENDPOINT+team_id+"/score",
		dataType: 'json',
		cache: false,
		success: function(data) {
			// THIS UPDATES THE SCORE ENTRIES
			if(data['Events'].length>0){
				var holder = $('<div>');
			    var row = $('<div>').addClass("indivTeamRow header");

				var eventTime = $('<div>')
					.addClass("rowHeader")
					.addClass("eventTime")
					.text('Timestamp')
				row.append(eventTime)

				var deltaValue = $('<div>')
					.addClass("rowHeader")
					.addClass("deltaValue")
					.html('Item Score')
				row.append(deltaValue)

				var reason = $('<div>')
					.addClass("rowHeader")
					.addClass("reasonHeader")
					.text('Reason')
				row.append(reason)

				holder.append(row);

				// updating team trend
				currentVals = getTrend();
				var trendVal = currentVals['Trend'];
				if(trendVal>0){
					$('#trendEntry').removeClass("negativeTrend");
					$('#trendEntry').addClass("positiveTrend");
				}else{
					$('#trendEntry').removeClass("positiveTrend");
					$('#trendEntry').addClass("negativeTrend");
				}
				$('#trendEntry').html(trendVal);
				$('#scoreEntry').html(currentVals['CurrentScore'].toFixed(3));
				// loop through the data and populate the log entries

				for(var i = 0; i< data['Events'].length; i++){
					// build html 
					var row = $('<div>').addClass("indivTeamRow");

					var date = moment(data['Events'][i]['EventTime']*1000);
					dateString = date.format('MM/DD/YYYY h:mm a');
					var eventTime = $('<div>')
						.addClass("eventTime")
						.text(dateString);
					row.append(eventTime);

					var deltaValue = $('<div>')
						.addClass("deltaValue")
						.text(data['Events'][i]['DeltaValue'].toFixed(3))
					row.append(deltaValue)

					var reason = $('<div>')
						.addClass("reason")
						.text(data['Events'][i]['Reason']);

					row.append(reason);
					// adding log entry to page
					holder.append(row);
				}
				$('#teamContent').html(holder)

			}else{
				// in case there's no entries show a message
				$('#teamContent').html('<div class="indivTeamRow" style="text-align:center;">No score entries yet!</div>')
			}
		},
		error: function(status, err) {
			console.error("scores", status, err.toString());
		}
	});
}

// populate histogram
function populateHistogram(input, update){
	//console.log(input)
	Chart.defaults.global.defaultFontColor='white';
	// need to remove existing iframe
	$('#histogramContainer').find("iframe").remove();
	// set canvas height to 250
	$('#histogram').attr("height","250");
	var barChartData = {
	      labels: input['Categories'],
	      datasets: [
	      {
  	          label: "Cumulative Score",
                type:'line',
                data: input['CumulativeScore'],
                fill: false,
                borderColor: '#e57735',
                backgroundColor: '#e57735',
                // pointBorderColor: '#e57735',
                // pointBackgroundColor: '#e57735',
                pointHoverBackgroundColor: '#e57735',
                pointHoverBorderColor: '#e57735',
                yAxisID: 'y-axis-2'
  	      },
  	      {
	          type: 'bar',
	          label: "Trend",
              data: input['Trend'],
              fill: false,
              backgroundColor: '#0091ce',
              borderColor: '#0091ce',
              hoverBackgroundColor: '#0091ce',
              hoverBorderColor: '#0091ce',
              yAxisID: 'y-axis-1'
	      } ]
	  };

	if(update==true){
		window.myBar.destroy();
		console.log("updated graph")
		var ctx = document.getElementById("histogram").getContext("2d");
		window.myBar = new Chart(ctx, {
			type: 'bar',
			data: barChartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					mode: 'label'
				},
				elements: {
				  line: {
				      fill: false
				  },
				  point: { 
				  	radius: 0 ,
				  	hitRadius: 4, 
				  	hoverRadius: 4
				  }
				},
				scales: {
				  xAxes: [{
				      display: true,
				      gridLines: {
				          display: false
				      },
				      showXLabels: 10,
				      categorySpacing: 0
				  }],
				  yAxes: [{
				      type: "linear",
				      display: true,
				      position: "left",
				      id: "y-axis-1",
				      gridLines:{
				          display: false
				      },
				      scaleLabel: {
			              display: true,
			              labelString: 'Trend'
				      }
				  },
				  {
				      type: "linear",
				      display: true,
				      position: "right",
				      id: "y-axis-2",
				      gridLines:{
				          display: false
				      },
				      scaleLabel: {
			              display: true,
			              labelString: 'Cumulative Score'
				      }
				  }]
				}
			}
		});
	}else{
		var ctx = document.getElementById("histogram").getContext("2d");
		window.myBar = new Chart(ctx, {
			type: 'bar',
			data: barChartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					mode: 'label'
				},
				elements: {
				  line: {
				      fill: false
				  },
				  point: { 
				  	radius: 0,
				  	hitRadius: 4, 
				  	hoverRadius: 4
				  }
				},
				scales: {
				  xAxes: [{
				      display: true,
				      gridLines: {
				          display: false
				      },
				      showXLabels: 10,
				      categorySpacing: 0,
				      barPercentage: 1.0,
            		categoryPercentage: 1.0,
				  }],
				  yAxes: [{
				      type: "linear",
				      display: true,
				      position: "left",
				      id: "y-axis-1",
				      gridLines:{
				          display: false
				      },
				      scaleLabel: {
			              display: true,
			              labelString: 'Trend'
				      }
				  },
				  {
				      type: "linear",
				      display: true,
				      position: "right",
				      id: "y-axis-2",
				      gridLines:{
				          display: false
				      },
				      scaleLabel: {
			              display: true,
			              labelString: 'Cumulative Score'
				      }
				  }]
				}
			}
		});
	}
}

function grabHistogram(queryStrings, update){
	team_id = queryStrings['tid']

	// AJAX call to hit API
	$.ajax({
		url: API_ENDPOINT+team_id+"/trend",
		dataType: 'json',
		cache: false,
		success: function(data) {
			// need to create input data to give to chart
			var inputData = []
			inputData['Categories'] = []
			inputData['CumulativeScore'] = []
			inputData['Trend'] = []

			for(var i = 0; i< data.length; i++){
				var date = moment(data[i]['Timestamp']*1000);
				dateString = date.format('h:mm a');
				inputData['Categories'].push(dateString);
				inputData['CumulativeScore'].push(data[i]['CurrentScore']);
				inputData['Trend'].push(data[i]['Trend']);
			}
			populateHistogram(inputData, update);
		},
		error: function(status, err) {
			console.error("scores", status, err.toString());
		}
	});
}
// hits the team specific endpoint to retrieve trend
function getTrend(){
	var trend;
	$.ajax({
		url: API_ENDPOINT+team_id,
		dataType: 'json',
		cache: false,
		async: false,
		success: function(data) {
			trend=[]
			trend['Trend'] = data['Trend'];
			trend['CurrentScore'] = data['CurrentScore']
			$('#teamNameSpan').html(data['Metadata']['name']);

			$('#innerBadges').html('');
			// UPDATE BADGES ON PAGE
			var counter=0
			$.each(data['Badges'], function(key, value) {
				counter++;
			    console.log(key, value);
			    var badge = $('<div>')
			    	.attr('class','badge');
			    var icon = $('<img>')
			    	.attr('src',value['IconUrl'])
			    badge.append(icon);
			    badge.append("<br>");
			    var text = $('<span>'+value['Name']+'</span>')
			    	.attr('class','badgeText');
			    badge.append(text);

			    badge.tooltip({
			        items: "div",
			        tooltipClass: "tooltip",
			        content: value['Description'],
			        track: true
			    });
			    $('#innerBadges').append(badge);
			});
			if (counter==0) {
				$('#innerBadges').html('<span style="font-size:16px;font-style:italic;font-weight:normal">You have not earned any badges yet!</span>')
			}

		},
		error: function(status, err) {
			console.error("scores", status, err.toString());
		}
	});
	return trend;
}
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	// NEED to implement a check if the game id wasn't specificed in the url
	// if vars['gid']
	return vars;
}
//creating the link to go to the main scoreboard page
function generateLink(queryStrings){
	game_id = queryStrings['gid']
	var link = $('<a></a>')
		.attr("href","index.html")
		.append("<span class='backLink'>< Back to Scoreboard</span>")
	$('#link').html(link)
}

// grabbing team ID and game ID from url
var queryStrings = getUrlVars()

// creating link to main scoreboard page
generateLink(queryStrings)

// creating the details
// document on ready function
$(document).ready(function () {
	// initialize tooltip
	$("#teamTrend").tooltip({
	    items: "div",
	    tooltipClass: "tooltip",
	    content: "This is the sumation of all score entries against your team for the past minute.  If this is very low or negative, you should investigate!"
	});
	grabDetails(queryStrings);
	grabHistogram(queryStrings, false);
});
// update log entries every second
updateEntries = window.setInterval(function(){grabDetails(queryStrings)}, 5000);
makeHistogram = window.setInterval(function(){grabHistogram(queryStrings, true)}, 60000);