const express = require('express'),
      router = express.Router();
      const { ensureAuthenticated } = require('../config/auth');

      const Doctor = require('../model/Doctor');
    

router.get('/', (req, res) => {

    res.render('index');

})

router.get('/about', (req, res) => {

    res.render('about');

});

router.get('/contact', (req, res) => {

    res.render('contact');

});



router.get('/search', (req, res) => {
res.render('search')
});


router.post('/', (req,res)=>{

        Doctor.find({fName:req.body.user}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log({record:result})
                res.render('search', {record:result,fName:req.body.user})
            }
        })
})


module.exports=router; 