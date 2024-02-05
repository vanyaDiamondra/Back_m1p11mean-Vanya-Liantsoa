const mongoose = require(`mongoose`)

const URI = `mongodb+srv://beautysalon:roTpCJp8pNyjBrK7@cluster0.9t0n88f.mongodb.net/Salon`

const connectDB = async()=> {
    try{
        mongoose.set("strictQuery", false)
        await mongoose.connect(URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log('db connected successfully')
    }catch(err){
        console.log(err)
    }
}
module.exports = connectDB
