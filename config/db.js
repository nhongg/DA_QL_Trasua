const mongoose = require("mongoose");


const uri = "mongodb+srv://shallot38hk:62WWpx8QQGvpyzTk@cluster0.4vigwt9.mongodb.net/studio_aocuoi" 


const connect = async () => {
    try{
        await mongoose.connect(uri);
        console.log('connect success')
    }catch(err){
        console.log(err);
        console.log('connect fail')
    }
}

module.exports = {connect}