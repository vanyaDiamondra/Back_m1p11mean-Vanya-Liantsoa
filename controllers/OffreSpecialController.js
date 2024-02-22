const OffreSpecial = require("../models/OffreSpecialModel");

const getOffres = async (req, res, next) => {
  try {
    const offres = await OffreSpecialModel.find();
    res.json(offres);
  } 
  catch (err) {
    throw err.message;
  }
};


// Server-Sent Events 
const sse = async (req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendOffre = offre => {
    try {
      console.log('Sending offre:', offre);
      res.write(`data: ${JSON.stringify(offre)}\n\n`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  try {
    const stream = OffreSpecial.find().tailable().cursor();
    stream.on('data', offre => {
      sendOffre(offre);
    });

    stream.on('error', err => {
      console.error('Error streaming notifications:', err);
    });

    stream.on('close', () => {
      console.log('Notification stream closed');
    });

    req.on('close', () => {
      stream.close();
    });
  }
  catch (error) {
    console.error('Error setting up notification stream:', error);
  }

  
};


module.exports = { getOffres ,sse };