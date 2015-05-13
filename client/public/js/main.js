$(document).ready(function () {
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
	
	
	
	

});

});