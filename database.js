const mongoose = require('mongoose');
require('dotenv').config()

const config = {
    autoIndex : false, 
    useNewUrlParser : true,
    useUnifiedTopology : true
  }


mongoose.connect("mongodb+srv://sa:Contra123@cluster0.typgrkr.mongodb.net/Exercisetrackerdb", config);

let UsersSchema = new mongoose.Schema({  username: {type : String}});

let ExercisesSchema = new mongoose.Schema ({
    userId: {type : String, required : true},
    description: {type : String, required  : true},
    duration: {type : Number, min : 1, required  : true},
    date: {type : Date, default : Date.now()}})

const UserModel =  mongoose.model('Users', UsersSchema)
const ExercisesModel = mongoose.model('Exercises', ExercisesSchema);

const createUser= (username, done) => {
  try{
    const Users = new UserModel({username});

    Users.save(function(err, data){
        if(err) return console.log(err);
       
        done(null, data)
    }); 

  }catch(error){
    console.log(error);
  }
}
// id = 62cb4590b00431b211b986a7
const createExercises = (userId, description, duration, date, done) => {
    const Exercises = new ExercisesModel({userId, description, duration, date});
    Exercises.save(function(err, data){
      if(err) return console.log(err);
      done(null, data);
    })
  
}
const findOneUserById = (userId, done) =>{
    UserModel.findById(userId, function(err, data) {
      if(err)return console.log(err)
      done(null, data)
    })
}
const findExercisesByUser = (userId,limit, startdate, enddate, done) =>{
 
  ExercisesModel.find({userId , date : {$gte : startdate, $lte : enddate}})
                .sort({date : 'asc'})
                .limit(limit)
                .exec( function(err, data){
                  if(err) return console.log(err);
                  done(null, data)
                });
}

const findUsers = (done) => {
  UserModel.find({}, function(err, data){
    if(err) return console.log(err);
    done(null, data);
  })
}

  exports.createUser = createUser;
  exports.createExercises = createExercises;
  exports.findUsers = findUsers;
  exports.findOneUserById = findOneUserById;
  exports.findExercisesByUser  = findExercisesByUser ;