$(document).ready(function () {
console.log("testy");
//list from http://tvline.com/2013/06/03/100-best-written-tv-shows-ever-the-sopranos/

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
		$('#search_bar').focus();
	});


/*
	Fuctions that lets the search reduce itself, when the search-field is open
	and the user clicks somewhere on the screen except the search-field /
	search-button
*/
	$(document.body).click(function(e){

	//var element = $("#79168 .left p")[0];
	//cutSeriesName(element);
	
	//var element = $("#262980 .left h2")[0];
	//cutSeriesName(element);
	
	
		var $box = $('#search');
		if(/*e.target.id !== 'search' &&*/ !$.contains($box[0], e.target)){
		
			reduceSearch();
		}
	});

/*
	Lets the Search Bar slides in again
*/
	function reduceSearch(){
	if($('#search_bar').hasClass('active')){
	  $('#search_button .glyphicon').removeClass('glyphicon-search');
	  $('#search_button .glyphicon').addClass('glyphicon-plus');
	  $('#search_bar').removeClass('active');
	  $('#search_button').css('border-top-left-radius', '4px');
	  $('#search_button').css('border-bottom-left-radius', '4px');
	  $scope.searchString = [];
	  }
	};
});

/*
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
*/

/* SubString Function */


function cutSeriesName(element) {

	var secureCount = 0;
	var episodeName;
	
	while(true){
		episodeName = element.innerHTML;
		if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
			element.innerHTML = episodeName.slice(0, episodeName.length-1);
		} else {
			element.innerHTML = episodeName.slice(0, episodeName.length-2) + "..";
			break;
		}
		
		secureCount++;
		if(secureCount > 50){
			break;
		}
	
	}
};




