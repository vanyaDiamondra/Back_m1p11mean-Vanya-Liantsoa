const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "utilisateur",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 },
},{collection:'token'});

const Token = mongoose.model('token', tokenSchema);
module.exports = Token;