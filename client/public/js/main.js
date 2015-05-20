$(document).ready(function () {


/*
	ProgressBar Function
	If User clicks on the +1 Button, the progress bar fills itself
*/	
	$('.label-warning').click(function () {	
		var progressBar = $(this).closest(".col-xs-12").find('.progress-bar');
		//get number of episodes in current season
		//var nrTotal = ...
		//get new current percentage
		//var curPerc = curEpisode / nrTotal;
		var newPerc = parseInt($(progressBar).attr("aria-valuenow")) + 10;
		if(newPerc >= 100){
			newPerc = 100;
			$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
			$(this).removeClass('label-warning').addClass('label-success');
			$(this).html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
		}
		$(progressBar).attr("aria-valuenow", newPerc);
		$(progressBar).css({width: newPerc + "%"});
	});

/*
	NewList Function
*/

/*
	SpoilerDescription Function
	Allows to open and close the description for a single episode
*/
	$('.season_list li h4').click(function () {
		if (!$(this).hasClass('active')) {
			$('.season_list li').removeClass('active');
			$('.season_list li p').slideUp();
			$(this).addClass('active');
			$(this).find('p').slideDown();
			/*
			$(this).next('.season_list li p').slideDown();
			*/
		} else {
			$('.season_list li').removeClass('active');
			$('.season_list li p').slideUp();
		}
		return false;	
	});

/*
	SearchBox Function
	Open and closes the search box
*/
	$('#search_button').click(function() {
		if($('#search_bar').hasClass('active')){
			search();
		} else {
			$('#search_button .glyphicon').removeClass('glyphicon-plus');
			$('#search_button .glyphicon').addClass('glyphicon-search');
			$('#search_bar').addClass('active');
			$('#search_button').css('border-top-left-radius', '0px');
			$('#search_button').css('border-bottom-left-radius', '0px');
		}
	});

	/* Small function, that detects if the user uses the enter button */
	$("#search_bar").keyup(function (e) {
    	if (e.keyCode == 13) {
        	search();
    	}
	});

	/* reduceSearch shall be called, when user clicks somewhere else */
	$(document.body).click(function(e){
		var $box = $('#search');
		if(/*e.target.id !== 'search' &&*/ !$.contains($box[0], e.target)){
			reduceSearch();
		}
	});

	/* Lets the search shrinks again */
	function reduceSearch(){
	if($('#search_bar').hasClass('active')){
	  $('#search_button .glyphicon').removeClass('glyphicon-search');
	  $('#search_button .glyphicon').addClass('glyphicon-plus');
	  $('#search_bar').removeClass('active');
	  $('#search_button').css('border-top-left-radius', '4px');
	  $('#search_button').css('border-bottom-left-radius', '4px');
	  }
	};

	/* Search Function */
	function search() {
		alert("Sorry Bruder, Suche kommt noch!");
	};

});