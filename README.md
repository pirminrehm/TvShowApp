A mobile web application using the TvDataBase API.



#Getting started
1. Install nodeJS.
2. Install MongoDB and start the deamon.
3. Get the private-directory and add it to the root of the app

##Server
1. Go into the directory `/server` with your shell and  init node with `npm install` 
2. Now can start the server with `npm start`
3. Open a second shell and go into `/server/crawler` and start with `node crawlerStart` the crawler
4. If you want to run the tests you can use `npm test` inside the `/server` directory. Stop before the server and the crawler.

##Client
1. Go to the directory `/client` 
2. Get all node.js packages with `npm install` 
3. Get all necessary libraries with `bower install`
4. Now you can start the server with `npm start`

###Using Grunt
1. If you haven't installed the grunt cli then install it with `npm install -g grunt-cli`
2. Go to the directory `/client` 

####Development
* To generate the `index.dev.html` run `grunt dev`
* The URL to this development view starts with: `http://localhost:8080/index.dev.html#/...`
* The grunt development task takes the `index.tpl.html` file and includes all necessary javascript and css files

####Production
* To generate the `index.html` run `grunt prod`
* The URL to the production view starts with: `http://localhost:8080/#/...`
* The grunt production task concatenates all custom javascript files. The minified version is stored in `build/custom.min.js`. Furthermore this tasks adds the necessary browser vendor prefixes to the css rules using the "can i use?" database. The minified result is written into `style.min.css`

####Format
* To format all custom javascript files run `grunt format`
* The jscs formatter uses the configuration in `.jscsrc`






#Documentation for the REST-API `localhost:3000`

##Routes
### User based requests `/usr`
The prerouting for all user routes is `/usr`
#### Registration
##### Register an new user `/register`
POST a JSON to `/usr/register` with the following content:
```
{ "email" : "yourmail@example.com"}
```
###### Success:
**Client:** The client should check the `status`, if it is `200` forward to an new site, e.g. "Wait for mail..."

The server will try to send directly a email to the given address with a new created token. This may take more than 2 seconds. If everything is OK the Server will respond with:
```
Status: 200, {"message" : "You should recieve an Email with your login token"}
```
###### Errors:
**Client:** The client should check the `status`, if it is `500` alert `response.body.error` 


Could not send the mail:
```
Status: 500, {"error" : ErrorStack }
```
MongoDB error:
```
Status: 500, {"error" : ErrorStack }
```
MongoDB unknown error:
```
Status: 500, {"error" : "Error: insert user failed" }
```
Error while create token:
```
Status: 500, {"error" : ErrorStack }
```
Eror while validate email:
```
Status: 500, {"error" : ErrorStack }
```
Email already in use:
```
Status: 500, {"error":"For this email an account already exists"}
```

##### Register an new user `/register/verify/:token`
GET request to `/usr/register/verify/:token` without content.

The token could look like this: `19bfca40a1d17d063de4dde03f967ad3e09b4763`

If the token is not verified yet and exists in the DB, the corresponding user will get verified
###### Success
**Client:** The client should check the `status`, if it is `200` forward to an new site, e.g. "Successfull verified"

If the user validation was successfull, the server will respond the user data.
```
Status: 200, 
{ token: '19bfca40a1d17d063de4dde03f967ad3e09b4763',
  validated: true,
  email: 'yourmail@example.com',
  series: [] }
```

###### Errors:
**Client:** The client should check the `status`, if it is `500` alert `response.body.error` 

The email is already validated:
```
Status: 500, { "error" : "Your token is already validated for yourmail@example.com" }
```
Wrong/incorrect token:
```
Status: 500, { "error" : "We could't find your user token" }
```
MongoDB error:
```
Status: 500, {"error" : ErrorStack }
```

##### Get Mail with Token `/mail/get`
POST request to `/usr/mail/get` with the following content:
```
{ "email" : "yourmail@example.com"}
```

If there is an corresponding account in the db, an email with link to login will be send.
###### Success
**Client:** The client should check the `status`, if it is `200` show "You got mail" notification.

If the mail has been send successfully, the server will respond:
```
Status: 200, 
{"message":"Email successfull send"}
```

###### Errors:
**Client:** The client should check the `status`, if it is `500` alert `response.body.error` 

The email is unknown:
```
Status: 500, {"error" : "Not an accout registered for this Mail" }
```
MongoDB error:
```
Status: 500, {"error" : ErrorStack }
```
Email error:
```
Status: 500, {"error" : ErrorStack }
```






#### User operations
Prerouting is still /usr
###### Errors, which can always occur:
Wrong/incorrect token:
```
Status: 500, { "error" : "We could't find your user token" }
```
MongoDB error:
```
Status: 500, {"error" : ErrorStack }
```


##### User adds new series to his list
`GET  /token/:token/series/:seriesId`
* downloads the whole series from TvDatabase and stores it into our local MongoDB
* adds the new series to User.series array (watched attribut of the episodes is false)
* **Return:** User

###### Errors: 
seriesId not found (TvD returns a 404 error):
```
Status: 500, {"error" : "Error: seriesId not found"}
```
cannot update user:
```
Status: 500, {"error" : "Error: update user failed (added series)"}
```
cannot parse the response of TvD into JSON
```
Status: 500, {"error" : "Error: parsing response from TvD into JSON failed"}
```
cannot store the downloaded series from TvD in our local DB
```
Status: 500, {"error" : "Error: store series retrieved from TvD failed"}
```
user has this series already in his list
```
Status: 500, {"error":"Series already in users list"}
```

##### User removes series from his list
`DELETE  /token/:token/series/:seriesId`
* removes the series from the User.series array
* **Return:** User

###### Errors:
seriesId not found:
```
Status: 500, { "error" : "Error: seriesId not found" }
```
cannot update user:
```
Status: 500, {"error" : "Error: update user failed (delete series)"}
```

##### Get user information
`GET  /token/:token/user/all`
* get all information about a user (including his series)
* **Return:** User 

###### Errors:
User not found:
```
Status: 500, { "error" : "Error: User not found" }
```


##### User marks an episodes as watched
`PUT  /token/:token/watched/:bool/episode/:episodeId`
* changes the value of the watched attribut in an episode
* **Return:** User

###### Errors:
cannot update user:
```
Status: 500, { "error" : "Error: update user failed (mark episode)" }
```
episodeId not found:
```
Status: 500, { "error" : "Error: episodeId not found" }
```

##### User marks an season as watched
`PUT  token/:token/watched/:bool/series/:seriesId/season/:seasonNr`
* changes the value of the watched attribut in all episodes of an season
* **Return:** User

###### Errors:
cannot update user:
```
Status: 500, { "error" : ErrorStack }
```
Season not found:
```
Status: 500, { "error" : "Error: Season in user not found" }
```
Series not found:
```
Status: 500, { "error" : "Error: Series in user not found" }
```



### Series based requests `/series`
The prerouting for all user routes is `/series`
###### Errors, which can always occur:
Wrong/incorrect token:
```
Status: 500, { "error" : "We could't find your user token" }
```
MongoDB error:
```
Status: 500, {"error" : ErrorStack }
```
##### Get series details
`GET  /token/:token/series/:seriesId/details`
* get all meta information of a series but not the episodes
* **Return:** Series.Series

###### Errors:
seriesId not found:
```
Status: 500, { "error" : "Error: seriesId not found" }
```


##### Get episode details
`GET  /token/:token/episode/:episodeId/details`
* get all meta information of an episode
* **Return:** Episode

###### Errors:
episodeId not found:
```
Status: 500, { "error" : "Error: episodeId not found" }
```
 
