

function Series(id, title, episodeAllCount, eipsodeWatchedCount, curEpisodeName) {

	//alert(episodeAllCount);
	this._id = id;
	this.episodeAllCount = episodeAllCount;
	this.eipsodeWatchedCount = eipsodeWatchedCount;
	this.incrementAmount = (1/episodeAllCount) * 100;
	//alert(incrementAmount);
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
var object = {
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
                        "watched": true,
                        "_id": "557435e39c840bbc0c2473ac"
                    },
                    {
                        "id": 4481708,
                        "watched": true,
                        "_id": "557435e39c840bbc0c2473ab"
                    }/*,
                    {
                        "id": 4481709,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473aa"
                    },
                    {
                        "id": 4481710,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a9"
                    },
                    {
                        "id": 4481711,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a8"
                    },
                    {
                        "id": 4481712,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a7"
                    },
                    {
                        "id": 4481713,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a6"
                    },
                    {
                        "id": 4481714,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a5"
                    },
                    {
                        "id": 4481715,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a4"
                    },
                    {
                        "id": 4481716,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a3"
                    },
                    {
                        "id": 4481717,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a2"
                    },
                    {
                        "id": 4481718,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a1"
                    },
                    {
                        "id": 4481719,
                        "watched": false,
                        "_id": "557435e39c840bbc0c2473a0"
                    },
                    {
                        "id": 4549213,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24739f"
                    },
                    {
                        "id": 4741188,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24739e"
                    },
                    {
                        "id": 4741189,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24739d"
                    },
                    {
                        "id": 4741190,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24739c"
                    },
                    {
                        "id": 4741191,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24739b"
                    },
                    {
                        "id": 4741192,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24739a"
                    },
                    {
                        "id": 4741193,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247399"
                    },
                    {
                        "id": 4741194,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247398"
                    },
                    {
                        "id": 4741195,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247397"
                    },
                    {
                        "id": 4741196,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247396"
                    },
                    {
                        "id": 4741197,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247395"
                    },
                    {
                        "id": 4741198,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247394"
                    },
                    {
                        "id": 4741199,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247393"
                    },
                    {
                        "id": 5043395,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247392"
                    },
                    {
                        "id": 5043396,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247391"
                    },
                    {
                        "id": 5043397,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247390"
                    },
                    {
                        "id": 5043398,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24738f"
                    },
                    {
                        "id": 5043399,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24738e"
                    },
                    {
                        "id": 5043400,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24738d"
                    },
                    {
                        "id": 5043401,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24738c"
                    },
                    {
                        "id": 5043402,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24738b"
                    },
                    {
                        "id": 5043403,
                        "watched": false,
                        "_id": "557435e39c840bbc0c24738a"
                    },
                    {
                        "id": 5043404,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247389"
                    },
                    {
                        "id": 5043406,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247388"
                    },
                    {
                        "id": 5043412,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247387"
                    },
                    {
                        "id": 5043417,
                        "watched": false,
                        "_id": "557435e39c840bbc0c247386"
                    }*/
                ]
            }
        ]
    };
	
	