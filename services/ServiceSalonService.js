const PrefEmploye = require("../models/PrefEmployeModel");
const ServiceModel = require("../models/ServiceModel");
const PrefServiceModel = require("../models/PrefServiceModel");

const getPreferenceEmployeParService =  async (userId, service)  => {
    const employeList = service.employe;

    const prefEmployeService = await PrefEmploye.find({'client._id': userId.userId, 'service._id': service._id});
    let result = [];

    for (let employe of employeList) {
        const employePreferences = await PrefEmploye.find({ 'employe._id': employe._id,'client._id': userId.userId }).sort({ date: -1 }).limit(1).exec();
        const score = employePreferences && employePreferences.length > 0 ? employePreferences[0].note : 0;
        console.log(employePreferences);

        const employeObject = employe.toObject();
        employeObject.note = score;
        result.push(employeObject);
    }
    var response = service.toObject();
    response.employePreferee = result;

    return response;
}
const getPrefService= async(userId)=>{
    const services = await ServiceModel.find();
    let result = [];
    //console.log(services);
    for (let service of services) {
        const prefService = await PrefServiceModel.find({ 'service._id': service._id,'client._id': userId.userId }).sort({ date: -1 }).limit(1).exec();
        const score = prefService && prefService.length > 0 ? prefService[0].note : 0;

        const serviceObject = service.toObject();
        serviceObject.note = score;
        result.push(serviceObject);
    }
    result.sort((a, b) => b.note - a.note);

    return result;
        
    
}

module.exports = {getPreferenceEmployeParService,getPrefService}
