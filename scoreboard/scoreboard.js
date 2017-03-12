// grabs the scores from the API
function grabScores(){
	// AJAX call to hit the API
	$.ajax({
		url: "https://api.<DOMAIN>/team",
		type: "GET",
		cache: false,
	    success: function(data) {
			if(data.length>0){
				// building table headers
				var row = $('<div>').addClass("teamRow header").attr("style","margin-bottom:0px;font-weight:bold;");
				var teamName = $('<div>')
					.addClass("teamName")
					.text('Team Name');
				row.append(teamName);
				var teamScore = $('<div>')
					.addClass("teamScore")
					.attr("style","text-align:center;padding-right:0px;width:25%")
					.text('Score');
				row.append(teamScore);
				var teamTrend = $('<div>')
					.addClass("teamTrend")
					.text('Score Trend')
					.attr("id","scoreTrend");
				row.append(teamTrend);
				$('#content').html(row);
				// adding tooltip to score trend
				$("#scoreTrend").tooltip({
				    items: "div",
				    tooltipClass: "tooltip",
				    content: "This is the sumation of all score entries against your team for the past minute.  If this is very low or negative, you should investigate!"
				});
				var noTeams=true;
				// loop through the data and populate the scoreboard
				for(var i = 0; i< data.length; i++){
					if (data[i]['Metadata'] != null){					
						if (data[i]['Metadata'].hasOwnProperty('name')){
							noTeams=false;
							// build html 
							var row = $('<div>').addClass("teamRow");
							// sanitizing team name
							var span = $('<span></span>')
								.text(data[i]['Metadata']['name'].substring(0,50));
							var link = $('<a></a>')
								.attr("href","team.html?tid="+data[i]['TeamId'])
								.append(span);
							var teamName = $('<div>')
								.addClass("teamName")
								.append(link);
							row.append(teamName);
							var teamScore = $('<div>')
								.addClass("teamScore")
								.text(data[i]['CurrentScore'].toFixed(3));
							row.append(teamScore);
							var teamTrend = $('<div>')
								.addClass("teamTrend")
								.text(data[i]['Trend']);
							// need to see if their score is positive or negative and style accordingly
							if(data[i]['Trend']>0){
								teamTrend.addClass("positiveTrend");
							}else{
								teamTrend.addClass("negativeTrend");
							}
							row.append(teamTrend);
							// adding team to scoreboard
							$('#content').append(row);
						}
					}
				}
				if (noTeams){
					$('#content').html('<div class="indivTeamRow" style="text-align:center;">No teams are on the board yet!</div>');
				}
			}else{
				// in case there's aren't any teams show a message
				$('#content').html('<div class="indivTeamRow" style="text-align:center;">No teams are on the board yet!</div>');
			}
		},
		error: function(status, err) {
			console.error("scores", status, err.toString());
		}
	});
}

// grabbing teams from API
grabScores();
// updating scoreboard every second
updateScoreboard = window.setInterval(grabScores, 5000);
