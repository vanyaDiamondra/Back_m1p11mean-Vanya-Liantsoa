const moment = require('moment');
const HoraireEmpModel = require('../models/HoraireEmpModel');
const RdvModel = require('../models/RdvModel');

// temps moyen de travail par employé
const tempsMoyenParEmploye = async () => {
  try {
    const result = await HoraireEmpModel.aggregate([
      {
        $addFields: {
          debutDate: {
            $toDate: {
              $concat: ["2000-01-01", "T", "$debut"]
            }
          },
          finDate: {
            $toDate: {
              $concat: ["2000-01-01", "T", "$fin"]
            }
          }
        }
      },
      {
        $group: {
          _id: "$employe.id",
          employe: {
            $first: {
              _id: "$employe.id",
              nom: "$employe.nom",
              prenom: "$employe.prenom"
            }
          },
          total: {
            $sum: {
              $divide: [
                { $subtract: ["$finDate", "$debutDate"] },
                3600000 
              ]
            }
          },
          count: { $sum: 1 } // compter le nombre d'horaires par employé
        }
      },
      {
        $project: {
          _id: 1,
          employe: "$employe",
          total: { $divide: ["$total", "$count"] }
        }
      }
    ]);

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// nb de réservation par jour par mois
const nbReservation = async (mois) => {
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  try {
    if( mois == undefined ){
      mois = 1;
    }

    const result = await RdvModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" }, 
          },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          "_id.month": mois,
        },
      },
    ]);

    const mergedResult = daysOfMonth.map(day => ({
      day,
      count: (result.find(r => r._id.day === day) || { count: 0 }).count, 
    }));
    
    return mergedResult;

  } catch (error) {
    console.log(error);
    return [];
  }
};


// chiffres d'affaires par jour par mois
const chiffreAffaires = async (mois) => {
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  
  try {
    if( mois == undefined ){
      mois = 1;
    }

    const result = await RdvModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" }, 
          },
          total: {
            $sum: "$service.prix"
          }
        }
      },
      {
        $match: {
          "_id.month": mois,
        },
      },
    ]);

    const mergedResult = daysOfMonth.map(day => ({
      day,
      total: (result.find(r => r._id.day === day) || { total: 0 }).total, 
    })); 
    return mergedResult;
  } 
  catch (error) {
    console.log(error);
    return [];
  }
};

// total bénéfice par mois
const beneficeTotal = async (mois) => {
  try {
    if( mois == undefined ){
      mois = 1;
    }

    const result = await RdvModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" }, 
          },
          total: {
            $sum: "$service.prix"
          }
        }
      },
      {
        $match: {
          "_id.month": 1,
        },
      },
    ]);

    console.log(JSON.stringify(result));

    const mergedResult = daysOfMonth.map(day => ({
      day,
      count: (result.find(r => r._id.day === day) || { count: 0 }).count, 
    }));
    
    return mergedResult;

  } catch (error) {
    console.log(error);
    return [];
  }
};


module.exports = { tempsMoyenParEmploye, nbReservation, chiffreAffaires };
