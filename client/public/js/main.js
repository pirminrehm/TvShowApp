


$(document).ready(function () {


var allSeriesNames = ["The Sopranos","Seinfeld","The Twilight Zone","All in the Family","M*A*S*H","The Mary Tyler Moore Show","Mad Men","Cheers","The Wire","The West Wing","The Simpsons","I Love Lucy","Breaking Bad","The Dick Van Dyke Show","Hill Street Blues","Arrested Development","The Daily Show with Jon Stewart","Six Feet Under","Taxi","The Larry Sanders Show","30 Rock","Friday Night Lights","Frasier","Friends","Saturday Night Live","The X-Files","Lost","The Cosby Show","Curb Your Enthusiasm","The Honeymooners","Deadwood","Star Trek","Modern Family","Twin Peaks","NYPD Blue","The Carol Burnett Show","Battlestar Galactica","Sex & The City","Game of Thrones","The Bob Newhart Show","Your Show of Shows","Downton Abbey, Law & Order","Thirtysomething","Homicide: Life on the Street","St. Elsewhere","Homeland","Buffy the Vampire Slayer","The Colbert Report","The Good Wife","Northern Exposure","The Wonder Years","L.A. Law","Sesame Street","Columbo","Fawlty Towers","The Rockford Files","Freaks and Geeks","Moonlighting","Roots","Everybody Loves Raymond","South Park","Playhouse 90","Dexter","My So-Called Life","Golden Girls","The Andy Griffith Show","Roseanne","The Shield","Murphy Brown","Barney Miller","The Odd Couple","Alfred Hitchcock Presents","Monty Python’s Flying Circus","Star Trek: The Next Generation","Upstairs, Downstairs","Get Smart","The Defenders","Gunsmoke","Justified","The Phil Silvers Show","Band of Brothers","Rowan & Martin’s Laugh-In","The Prisoner","Absolutely Fabulous","The Muppet Show","Boardwalk Empire","Will & Grace","Family Ties","Lonesome Dove","Soap","The Fugitive","Late Night with David Letterman","Louie"];
//list from http://tvline.com/2013/06/03/100-best-written-tv-shows-ever-the-sopranos/

$( "#search_bar" ).autocomplete({
source: allSeriesNames,

  select: function( event, ui ) {
  /*
  $scope.searchString = ui.item.value;
  */
	console.log(ui.item.value);
  }
});

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
		$('#search_bar').focus();
	});

	/* Small function, that detects if the user uses the enter button */
	// $("#search_bar").keyup(function (e) {
 //    	if (e.keyCode == 13) {
 //        	search();
 //    	}
	// });

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
