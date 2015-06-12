$(document).ready(function () {



/*
	ProgressBar Function
	If User clicks on the +1 Button, the progress bar fills itself
*/
	/*$('.label-warning').click(function () {
		progressBarUpdate(this);
	});*/


/*
	NewList Function
*/
	function newList() {
		// alert("FICK DICH DONNER"); 
		// var email = mailingfield.elements["mail-adress"].value;
		// var jsonFile = '{ "email" : "' + email + '"}';
		
		// $.ajax({
		// 	type: "POST",
		// 	url: "localhost:3000/usr/register",
		// 	data: jsonFile,
		// 	dataType: "json",
		// 	success: function(data){
		// 		alert('yay');
		// 	},
		// });

		// alert("!");
	}

/*
	SpoilerDescription Function
	Allows to open and close the description for a single episode

	Checkbox Function
	Lets the user check the episodes/series he has already seen
*/

	/* SpoilerDescription Function */
	$('.season_list div input').click(function () {
		var returnVal = confirm("Are you sure?");
		if(returnVal == true){
			var newBool = $(this).is(":checked");
			$(this).attr("checked", newBool);
			$('.season_list li').find('input').each(function(){
				$(':checkbox').prop("checked", newBool);
			}); 
		}
		$('.season_list div input').val($(this).is(':checked'));
	});
	
	/* Checkbox Function */
	/* BUG: Only check all the boxes of ONE Season */
	$('.season_list li').click(function (e) {
		if(e.target.className != 'checkbox'){
			if (!$(this).hasClass('active')) {
				$('.season_list li').removeClass('active');
				$('.season_list li p').slideUp();
				$(this).addClass('active');
				$(this).find('p').slideDown();
			} else {
				$('.season_list li').removeClass('active');
				$('.season_list li p').slideUp();
			}
		}
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

	$(document.body).click(function(e){
		var $box = $('#search');
		if(/*e.target.id !== 'search' &&*/ !$.contains($box[0], e.target)){
			reduceSearch();
		}
	});

	function reduceSearch(){
	if($('#search_bar').hasClass('active')){
	  $('#search_button .glyphicon').removeClass('glyphicon-search');
	  $('#search_button .glyphicon').addClass('glyphicon-plus');
	  $('#search_bar').removeClass('active');
	  $('#search_button').css('border-top-left-radius', '4px');
	  $('#search_button').css('border-bottom-left-radius', '4px');
	  }
	};

	function search() {
		alert("Suche geht noch nicht, Bruder");
	};

});


function progressBarUpdate(context, incrementAmount){
alert(incrementAmount);
	var progressBar = $(context).closest(".col-xs-12").find('.progress-bar');
	//get number of episodes in current season
	//var nrTotal = ...
	//get new current percentage
	//var curPerc = curEpisode / nrTotal;
	var newPerc = parseInt($(progressBar).attr("aria-valuenow")) + incrementAmount;
	if(newPerc >= 100){
		//progressBarFull(context);
		newPerc = 100;
		$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
		$(context).removeClass('label-warning').addClass('label-success');
		$(context).html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
	}
	$(progressBar).attr("aria-valuenow", newPerc);
	$(progressBar).css({width: newPerc + "%"});
}

