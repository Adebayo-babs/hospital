const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Doctor = require('../model/Doctor');   

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username' }, (username, password, done) => {

            //match user
            Doctor.findOne({username:username})
            .then(doctor => {
                if(!doctor){
                    return done(null, false, {message: 'That Username is not registered'});
                }

                //Match password
                bcrypt.compare(password, doctor.password, (err, isMatch) =>{
                    if (err) throw err;

                    if(isMatch){
                        return done(null, doctor);
                    }
                    else{
                        return done(null, false, {message: 'password incorrect'})
                    }
                })
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((Doctor, done)=> {
        done(null, Doctor.id);
    });

    
    
    passport.deserializeUser((id, done)=> {
        Doctor.findById(id, (err, Doctor) => {
            done(err, Doctor);
        });
    });
}
