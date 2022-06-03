const express = require('express'),
            mongoose  = require('mongoose'),
            ejs = require('ejs'),
            app = express(),
            passport = require("passport"),
            session = require('express-session'),
            flash = require('connect-flash');
            require('./config/passport')(passport); 


//BELOW WE CONNECT TO MONGO DATABASE
      mongoose.connect("mongodb://localhost:27017/HOSPITAL", {useNewUrlParser:true, useUnifiedTopology:true});


      app.use(express.urlencoded({extended:true}));
      app.use(express.static("public"));
      app.set('view engine', 'ejs');

      //Express Session
      app.use(
      session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
      })
      );


      // passport middleware
      app.use(passport.initialize());
      app.use(passport.session());

//connect flash
app.use(flash());

 // Global Variables Middleware
 app.use((req, res, next) => {
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.name = req.user;
    next();
  });


    


      //Routes
      app.use('/', require('./routes/index')); 

      app.use('/doctor', require('./routes/doctor')); 


      app.listen(9090, function(){
            console.log("Server started on port 9090");
      })