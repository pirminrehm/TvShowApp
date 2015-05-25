A mobile web application using the TvDataBase API.

#Server `localhost:3000`

##Getting started
1. Install nodeJS.
2. Install MongoDB and start the deamon.
3. Go into the directory `/server` with your shell and  init node with `npm install` 
4. Now can start the server with `npm start`
5. If you want to run the tests, make sure you have installed mocha global: `npm install -g mocha`.
Now you can run `npm test`



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


#### User operations
Prerouting is still /usr
##### User adds new series to his list
`POST  /token/:token/series/:seriesId`
* downloads the whole series from TvDatabase and stores it into our local MongoDB
* adds the new series to User.series array (watched is by default false)
* **Return:** User

##### User removes series from his list
`DELETE  /token/:token/series/:seriesId`
* removes the series from the User.series array
* **Return:** User

##### Get user information
`GET  /token/:token/user/all`
* get all information about a user (including his series)
* **Return:** User 

##### User marks an episodes as watched
`PUT  /token/:token/watched/:bool/episode/:episodeId`
* changes the value of the watched attribut in an episode
* **Return:** User



### Series based requests `/series`
The prerouting for all user routes is `/series`
##### Get series details
`GET  /token/:token/series/:seriesId/details`
* get all meta information of a series but not the episodes
* **Return:** Series.Series

##### Get episode details
`GET  /token/:token/episode/:episodeId/details`
* get all meta information of an episode
* **Return:** Episode



 



