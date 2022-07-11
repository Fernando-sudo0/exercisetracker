const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const db = require('./database.js')

app.post('/api/users', (req, res) => {
//create a new user and return a json with username and id
//each user is different register
  const {username} = req.body

  db.createUser(username, function(err, data){
   
    if(err){
      return next(err)
    }
    if(!data){
      return next({message: 'Missing call argument'})
    }
    return res.json({data})
  })
});
app.get('/api/users', (req, res)=> {
  db.findUsers(function(err, data){
    if(err){
      return next(err)
    }
    return res.json({data})
  })

})
app.post('/api/users/:_id/exercises', (req, res) => {
  //create a exersice with an id, and callback with userId and username,
  const {description, duration, date} = req.body
  const userId = req.params._id
  var date2  = date

  if (date == undefined || date == '')
    date2 = new Date()

  db.findOneUserById(userId, function(err, userdata){
    if(err){
      return next(err)
    }
    if(!userdata){
      return next({message: 'User missing'})
    }

    db.createExercises(userId, description, duration, date2, function(err, data){
      if(err){
        return next(err)
      }
      return res.json({username : userdata.username, description: data.description, duration : data.duration, date : data.date.toUTCString(), _id : data._id});
    });
  })
})

// http://localhost:3000/api/users/62cb262d2407cf09260143a3/logs?from=2018-01-01&to=2023-07-23&limit=100
app.get('/api/users/:_id/logs?', (req, res) => {

var startDate = new Date(req.query.from);
var endDate = new Date (req.query.to);

db.findOneUserById(req.params._id,  function(err, userdata){
  if(err) return console.log(err)
    db.findExercisesByUser(req.params._id, req.query.limit, startDate, endDate, function(err, exersicedata){
      if(err){next(err)}
      return res.json({  _id : userdata._id, username: userdata.username, to : startDate, from : endDate,count : exersicedata.length , log : exersicedata.map(function(e){  return { description: e.description,duration :  e.duration, date : e.date.toUTCString() }})})
    })
  });
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


