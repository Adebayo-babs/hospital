const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({

    pName:{
        type:String,
        required:true
    },
    sex:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    num:{
        type:Number,
        required:true
    },   
    address:{
        type:String,
        required:true
    },
    pDiag:{
        type:String,
        required:true
    },
    smoke:{
        type:String,
        required:true
    },
    sDate:{
        type:Date,
        required:true
    },
    dDate:{
        type:Date,
        required:true
    },
    surg:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now     
    }
});

 module.exports = mongoose.model('Patient', patientSchema)