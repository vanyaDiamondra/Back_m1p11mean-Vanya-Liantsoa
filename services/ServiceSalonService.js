const PrefEmploye = require("../models/PrefEmployeModel");
const ServiceModel = require("../models/ServiceModel");
const PrefServiceModel = require("../models/PrefServiceModel");
const moment = require('moment-timezone');

const getPreferenceEmployeParService =  async (userId, service)  => {
    const employeList = service.employe;
    let result = [];

    for (let employe of employeList) {
        const employePreferences = await PrefEmploye.find({ 'employe._id': employe._id,'client._id': userId.userId }).sort({ date: -1 }).limit(1).exec();
        const score = employePreferences && employePreferences.length > 0 ? employePreferences[0].note : 0;
        
        const employeObject = employe.toObject();
        employeObject.note = score;
        result.push(employeObject);
    }
    var response = service.toObject();
    response.employePreferee = result;

    return response;
}

const getPrefService = async(userId)=>{
    const prefService = await PrefServiceModel.find({'client._id': userId.userId }).sort({ date: -1 }).exec();
    let result = [];

    for (let pref of prefService) {
        var service = await ServiceModel.findOne({_id: pref.service._id}).limit(1).exec();
        
        const object = service.toObject();
        object.note = pref.note;
        result.push(object);
    }
    result.sort((a, b) => b.note - a.note);
    return result; 
}

module.exports = {getPreferenceEmployeParService,getPrefService}
