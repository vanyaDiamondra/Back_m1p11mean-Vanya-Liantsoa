const PrefEmploye = require("../models/PrefEmployeModel");

const getPreferenceEmployeParService =  async (userId, service)  => {
    const employeList = service.employe;

    const prefEmployeService = await PrefEmploye.find({'client._id': userId.userId, 'service._id': service._id});
    let result = [];

    for (let employe of employeList) {
        const employePreferences = prefEmployeService.find(pref => pref.employe._id === employe.id);
        const score = employePreferences ? employePreferences.note : 0;

        const employeObject = employe.toObject();
        employeObject.note = score;
        result.push(employeObject);
    }
    var response = service.toObject();
    response.employePreferee = result;

    return response;
}

module.exports = {getPreferenceEmployeParService}
