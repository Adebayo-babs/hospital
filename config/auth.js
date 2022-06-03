const mongoose = require('mongoose')

module.exports ={
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }

        req.flash('error', 'Please log in to view the page');
        res.redirect('/doctor/login');   
    }
}
