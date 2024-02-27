const DepenseModel = require("../models/DepenseModel");
const Token = require("../models/Token");
const {secretKey,base_url} = require("../db/TokenKey");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const creer = async (req, res, next) => {
    try {
      
      
  
  
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const supprimer = async (req, res, next) => {

  }

  const modifier = async (req, res, next) => {

  }

  const rechercher = async (req, res, next) => {

  }

  const getall = async (req, res, next) =>{
    try{
      const details=await Depense.find({type:2});
      return res.json(details);
    }catch (error) {
      console.error('Error setting up notification stream:', error);
    }
  }
  module.exports = {creer,supprimer,modifier,rechercher,getall}