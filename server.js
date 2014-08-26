var express = require('express') ;
var app = express() ;
var mongoose = require('mongoose') ;
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


mongoose.connect('mongodb://kian:123@novus.modulusmongo.net:27017/dy6Xosun');

app.configure(function () {
    app.use(express.static(__dirname + '/public')) ;
    app.use(express.logger('dev')) ;
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));

}) ;
var Todo = mongoose.model('Todo' , {
    email : String ,
    password : String ,
    todos : [{
            text : String ,
            done : Boolean
        }]
}) ;
/* middleware --------------------------
app.use(express.basicAuth('user' , 'pass')) ;
*/

/* routes -------------------------------- */
app.get('/api/todos' , function (req, res) {
    Todo.findOne({ email : req.session.user } , function (err, user) {
        if (err) { res.send(err) ; }
        console.log(user) ;
        res.json(user) ;
    })
}) ;

app.get('/api/info' , function (req, res) {
    res.json(req.session) ;
}) ;

app.post('/api/todos' , function (req, res) {
    Todo.findOneAndUpdate({ email : req.session.user } , { $push : { todos :  { text : req.body.text , done : false }}} , function (err, data) {
        if (err) { errorHandler(err) }
        console.log(data) ;
        res.json(data.todos) ;
    } )
});


app.delete('/api/todos/:todo_text' , function (req, res) {
    if (req.params.todo_text == "0") {
        Todo.findOne({ email: req.session.user}, function (err, data) {
            if (err) { return errorHandler(err) }
            data.todos = {text : "شما همه یادآورهایتان را پاک کردید" , done :false };
            console.log(data) ;
            data.save(function (err) {
                if (err) {
                    errorHandler(err);
                }
            }) ;
            res.send(data.todos) ;
        });
    }
    else {
        Todo.findOneAndUpdate({ email : req.session.user } , { $pull : { todos :  { text : req.params.todo_text }}} , function (err, data) {
        if (err) { errorHandler(err) }
        console.log(data) ;
        res.json(data.todos) ;
    })
    }
}) ;


app.post('/api/register' , function (req, res) {
    Todo.find({ email : req.body.mail } , function (err, user) {
        if (user.length != 0 ) { res.json({ stat : false , msg : 'نام کاربری قبلا استفاده شده' }) }
        else {
            console.log("Creating new user");
            Todo.create( {
            email : req.body.mail ,
            password : req.body.pass ,
            todos : {}
        } , function (err , data ) {
            if (err) {res.send(err) }
            res.send({ stat : true , msg : "اکانت شما با موفقیت ایجاد شد . لطفا وارد شوید :) , ( " + data.email + " , ‌" + data.password + " )" }) ;
            }) ;
        }
    })

}) ;


app.post('/api/login' , function (req , res) {
    Todo.findOne( { email : req.body.mail } , function (err, user) {
        if (err) { res.send(err) ; }
        if (user) {
            if (user.password !== req.body.pass ) {
                res.json({ stat : false , msg : 'رمز عبور نا درست است' }) ;
            }
             else {
                //everything ok ...
                console.log("write to session ") ;
                req.session.user = user.email ;
                res.json({stat : true , msg : 'http://localhost:8080/home' }) ;
            }
        }
        else { res.json({ stat : false , msg : "نام کاربری مورد نظر یافت نشد"}) }
    })
}) ;

app.get('/api/logout' , function (req, res) {
    console.log(req.session);
    delete req.session['user'] ;
    console.log(req.session);
    res.json(req.session) ;
}) ;

app.get("/home" , function (req, res) {
    res.sendfile('./public/index.html') ;
}) ;
app.get('/auth' , function (req, res) {
    res.sendfile('./public/login.html') ;
});

app.listen(8080) ;
console.log("App listening on port 8080") ;
