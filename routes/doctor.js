const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    mongoose = require('mongoose'),
    passport = require('passport');
    const { ensureAuthenticated } = require('../config/auth');

 const Doctor = require('../model/Doctor');
 const Patient = require('../model/Patient');

 let fs = require('fs');
let path = require('path');
let multer = require('multer');

 // MULTER
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      console.log(file);
      cb(null, file.fieldname +'-'+ Date.now());
    }
  })
  
  let upload = multer({storage:storage});
  

router.get('/signup', (req, res) => {

    res.render('signup');

})



router.post('/signup', upload.single('image'), (req, res)=>{
    const{fName, lName, description, cEmail,cNumber, yearsOfExp, username, password,password2,date} = req.body;

    let errors = [];

    //Check passwords match

    if(password !== password2){
        errors.push({msg: "Passwords do not match"});
        req.flash('error_msg', 'Passwords do not match') 
    }

    //Check password length
    if(password.length < 8){
        errors.push({msg: "password should be at least eight characters"})
    }

    if(errors.length > 0){
        res.render('signup', {
            errors,
            fName, lName, description, cEmail,cNumber, yearsOfExp, 
        username, password,password2
        });

    }else{
        //validation passed
            Doctor.findOne({ username: username  })
            .then(doctor => {
                if(doctor){
                    //user exists
                    errors.push({msg: 'Username is already registered'});
                    res.render('signup', {
                        errors,
                        fName, lName, description, cEmail,cNumber, yearsOfExp, 
                       username, password,password2
                    });

                }
                else{
                    const newDoctor = new Doctor({
                        fName, lName, description, cEmail,cNumber, yearsOfExp, 
         username, password, date,  upload:{
            data:fs.readFileSync(path.join('C:/Users/HP/Desktop/FULLSTACK/HOSPITAL'+'/uploads/'+req.file.filename)),
            contentType: 'image/png'
          }

                    });
                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newDoctor.password, salt, (err, hash) => {
                            if(err) throw err;

                            //Set password hashed
                            newDoctor.password = hash;

                            //Save new user
                            newDoctor.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now successfully registered and can log in')
                                res.redirect('/doctor/login');
                            })
                            .catch(err => console.log(err))
                    }))

                }
            });
    }
});

//login handle

router.get('/login', (req, res) => {

    res.render('login');

})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/doctor/dashboard',
        failureRedirect:'/doctor/login',
        failureFlash:true
    })(req, res, next);
} );


//Dashboard

router.get('/dashboard', ensureAuthenticated, (req,res)=>{

        Doctor.find({username:req.user.username}, function(err, record){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log(req.user.username)
                res.render('dashboard', {record,username:req.user.username})
            }
        })

})

// Add Patient

router.get('/addPat', ensureAuthenticated, (req,res)=>{

        Patient.find({username:req.user.username}, function(err){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                // console.log(req.user.username)
                res.render('addPatient', {username:req.user.username})
            }
        })

})



router.post('/addPat', upload.single('image'), (req, res)=>{
    const{pName, sex, dob, email, num, address, pDiag, smoke, sDate, dDate, joint, surg} = req.body;

    let errors = [];

    if(errors.length > 0){
        res.render('add_property', {
            errors,
            pName, sex, dob, email, num, address, pDiag, smoke, sDate, dDate, surg
        });

    }else{
        //validation passed            
            const newPatient = new Patient({
                        pName, sex, dob, email, num, address, pDiag, smoke, sDate, dDate, surg, 
                        username:req.user.username
        });

            //Save new user
            newPatient.save()
            .then(user => {
            req.flash('success_msg', 'Patient added successfully')
            res.redirect('/doctor/viewPat');
            })
            .catch(err => console.log(err))
                    }

    });

//View Patient

router.get('/viewPat', ensureAuthenticated, (req,res)=>{

        Patient.find({username:req.user.username}, function(err, record){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log(req.user.username)
                res.render('viewPatient', {record,username:req.user.username})
            }
        })

});

//View Details

router.get('/details', ensureAuthenticated, (req,res)=>{

        Patient.find({username:req.user.username}, function(err, record){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log(req.user.username)
                res.render('details', {record,username:req.user.username})
            }
        })

});


//Edit Patient Details

router.get('/edit/:pid', (req, res) => {
    Patient.find({_id:req.params.pid}, (error, record) => {
                if (error) {
                    req.flash('error_msg', "Could not query database")
                    res.redirect('/edit/:pid');
                } else {
                    res.render('editPage', {record, username:req.user.username});
                }
            })
});

router.post('/edit/:pid', (req, res) => {
    
            const {pName, sex, dob, email, num, address, pDiag, smoke, sDate, dDate, surg, date} = req.body;

            Patient.updateOne({_id:req.params.pid}, {$set:{pName, sex, dob, email, num, address, pDiag, smoke, sDate, dDate, surg, date}}, (err, record) => {
                if (err) {
                    req.flash('error_msg', "Could not update Patient Details");
                    res.redirect('/doctor/edit/:pid');
                } else {
                    req.flash('message', "Patient's details successfully updated");
                    res.redirect('/doctor/viewPat')
                }
            })
        })

router.get('/:pid', (req, res) => {
        
         Patient.deleteOne({_id:req.params.pid}, (error, record) => {
            if (error) {
                req.flash('error_msg', "Could not query database")
            } else {
                req.flash('message', "Patient deleted successfully");
                res.redirect('/doctor/viewPat')
            }
        })
})
 


module.exports = router;