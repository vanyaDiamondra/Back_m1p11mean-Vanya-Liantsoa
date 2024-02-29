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
    if( mois == undefined || isNaN(mois) ){
      mois = 1;
    }

    const result = await RdvModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$datereservation" },
            month: { $month: "$datereservation" }, 
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
    if( mois == undefined || isNaN(mois) ){
      mois = 1;
    }

    const result = await RdvModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$datereservation" },
            month: { $month: "$datereservation" }, 
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

// total bénéfice par mois par an
const beneficeTotal = async (annee) => {
  const monthsOfYear = Array.from({ length: 12 }, (_, i) => i + 1);

  try {
    if( annee === undefined || isNaN(annee) ){
      annee = 2024;
    }

    const result = await RdvModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          chiffreAffaires: { $sum: "$service.prix" }
        }
      },
      {
        $match: {
          "_id.year": annee,
        },
      },
      {
        $lookup: {
          from: "depense",
          let: { month: "$_id.month", year: "$_id.year" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$mois", "$$month"] },
                    { $eq: ["$annee", "$$year"] }
                  ]
                }
              }
            }
          ],
          as: "depenses"
        }
      },
      {
        $unwind: {
          path: "$depenses",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          chiffreAffaires: { $first: "$chiffreAffaires" },
          depenses: { $sum: "$depenses.prix" }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          benefices: { $subtract: ["$chiffreAffaires", "$depenses"] }
        }
      }
    ]);

    const mergedResult = monthsOfYear.map(month => ({
      month,
      benefice: (result.find(r => r.month === month) || { benefices: 0 }).benefices, 
    }));
    
    return mergedResult;

  } catch (error) {
    console.log(error);
    return [];
  }
};


module.exports = { tempsMoyenParEmploye, nbReservation, chiffreAffaires, beneficeTotal };
