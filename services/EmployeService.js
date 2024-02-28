const RdvModel = require("../models/RdvModel");
const Rdv = require("../models/RdvModel");

// get rdv where employe = me
const getAllMyRdv = async (userId, monthValue)  => {
    var rdvList;

    if( monthValue !== undefined ){
        rdvList = await Rdv.find({
            'employe._id': userId.userId,
            $expr: { $eq: [{ $month: '$date' }, monthValue] }      // extract month = monthValue
        }).sort({ date: -1 });
    } 
    else{
        rdvList = await Rdv.find({'employe._id': userId.userId})
                    .sort({ date: -1 });
    }
    return rdvList;
}

// get rdv where employe = me and date = date
const todayRdv = async (userId, date, status)  => {
    var dateFilter = new Date();

    if( date !== 'undefined' ){
        dateFilter = date;
    }

    const startOfDay = new Date(dateFilter);
    startOfDay.setUTCHours(0, 0, 0, 0); 

    const endOfDay = new Date(dateFilter);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const rdvList = await Rdv.find({'employe._id': userId.userId, status: status,
                                    date: {
                                        $gte: startOfDay,
                                        $lte: endOfDay
                                    }
                                    }).sort({ heure_debut: 1 });
    return rdvList;
}

// update status on drag and drop
const setRdvFinish = async (rdvId, status)  => {
    const rdv = await Rdv.findOne({_id: rdvId});

    if (rdv) {
        rdv.status = status;
        await rdv.save();
    }  
}


module.exports = {getAllMyRdv, todayRdv, setRdvFinish}