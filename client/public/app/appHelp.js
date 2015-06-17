

function Series(id, title, bannerUrl,episodeAllCount, eipsodeWatchedCount, curEpisodeName) {

	//alert(episodeAllCount);
	this._id = id;
	this.episodeAllCount = episodeAllCount;
	this.eipsodeWatchedCount = eipsodeWatchedCount;
    this.bannerUrl = bannerUrl;
	this.incrementAmount = (1/episodeAllCount) * 100 + 0.0000000001;
	//alert(this.incrementAmount);
	this.percWatched = (eipsodeWatchedCount/episodeAllCount) * 100;
	
	this.progressBar = this.percWatched >= 100 ?
		'<span class="label label-warning" onclick="progressBarUpdate(this)">+1</span>' :
		'<span class="label label-success" onclick="progressBarUpdate(this)"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span>';
	//alert(this.percWatched);
	this.title = title;
	this.episodeNr = 'S010101';
	this.episodeTitle = 'testTitle';
	
	
	/*
	 //'<span class="label label-warning" onclick="progressBarUpdate(this, true)">+1</span>' +


	 if(newPerc >= 100){
	 //progressBarFull(context);
	 newPerc = 100;
	 $(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
	 $(context).removeClass('label-warning').addClass('label-success');
	 $(context).html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
	 }
	 */
}

// function SearchResult(id, title) {
// 	this.id = id;
// 	this.title = title;
// }


var exampleSeriesArray = {
        "_id": "5574356ed110c0b8184148ca",
        "token": "79c25df0ec4bf2d92872a299c299685f426a3602",
        "validated": true,
        "email": "tvshowapp-test1@7kw.de",
        "__v": 1,
        "series":
        [
            {
                "name": "House of Cards (US)",
                "id": "262980",
                "_id": "557435e39c840bbc0c247385",
                "episodes":
                [
                    {
                        "id": 4411361,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473ac"
                    },
                    {
                        "id": 4481708,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473ab"
                    },
                    {
                        "id": 4481709,
                        "watched": true,
                        "_id": "557435e39c840bbc0c2473aa"
                    }
                ]
            }
        ]
    };
	
	