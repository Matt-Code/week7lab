let express = require("express");
let bodyparser = require('body-parser');
let ejs = require('ejs');
let mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;

//Configure Express
let app = express()
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static('style'));
app.use(express.static('image'));
app.use(bodyparser.urlencoded({ extended: false }));
app.listen(8080);

let Task = require('./models/task');
let Developer= require('./models/developer');

let url='mongodb://localhost:27017/taskDBlab6';

mongoose.connect(url,{ useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Connect Successfully');
});

app.get('/newDeveloper',function(req,res){
    res.sendFile(__dirname+'/views/newDeveloper.html')
} );

app.post('/addNewDeveloper',function(req,res){
    let developerDetails = req.body;
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName:developerDetails.fname,
            lastName:developerDetails.lname
        },

        level: developerDetails.level,

        address:{
            state: developerDetails.state,
            suburb: developerDetails.suburb,
            street: developerDetails.street,
            unit: developerDetails.unit
        }
    });
    developer.save(function (err) {
        if (err) throw err;})
     res.redirect('listDeveloper')
});

app.get('/listDeveloper', function(req, res){
    Developer.find({},function(err,data){
        res.render('listDeveloper.html',{developer: data})})
        
    })
    
app.get('/newTask',function(req,res){
        res.sendFile(__dirname+'/views/newTask.html')
    })
app.post('/addNewTask', function(req, res){
    let taskDetails = req.body;
    let task = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: taskDetails.taskname,
        developer: ObjectId(taskDetails.assignto),
        dueDate:new Date(taskDetails.taskdue),
        taskStatus: taskDetails.taskstatus,
        taskDescription: taskDetails.taskdesc
    });
   
    task.save(function(err){
        if (err) throw err;})
     res.redirect('listTask')
    }) 
app.get('/listTask', function(req, res){
    Task.find(function(err,data){
    res.render('listTask.html',{taskDb: data})})
})

app.get('/deleteById', function(req, res){
    res.sendFile(__dirname+'/views/deleteById.html')
})
app.post('/deleteById', function(req, res){
    let taskDetails = req.body;
    Task.deleteOne({_id:taskDetails.taskid},function(err, result){

    })
    res.redirect('listTask')
})

app.get('/deleteAll', function(req, res){
    res.sendFile(__dirname+'/views/deleteAllCompleted.html')
})
app.post('/deleteAll', function(req, res){
    let taskDetails = req.body;
    Task.deleteMany({taskStatus:taskDetails.taskstatus},function(err, result){

    })
    res.redirect('listTask')
})

app.get('/updateTask', function(req, res){
    res.sendFile(__dirname+'/views/updateTask.html')
})
app.post('/updateTask', function(req, res){
    let taskDetails = req.body;
    Task.updateOne({_id:taskDetails.taskidold},{ $set: { taskStatus: taskDetails.taskstatusnew } },function(err, result){})

    res.redirect('listTask')
})


app.get('/:oldfirstname/:newfirstname', function(req, res) {
    let oldfirstname = req.params.oldfirstname;
    oldfirstname = oldfirstname.toUpperCase();
    let newfirstname = req.params.newfirstname;
    newfirstname = newfirstname.toUpperCase();

    let filter = {'name.firstName': oldfirstname};

    let update = {$set: {'name.firstName': newfirstname}};

    console.log(oldfirstname);
    console.log(newfirstname);   

    Developer.updateMany(filter, update, {
        upsert:false
    }, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log('Updated oldfname to newfname');        
        }
    });
    res.redirect('/listDeveloper'); 

});