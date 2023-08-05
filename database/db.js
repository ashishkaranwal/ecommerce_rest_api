const mongoose = require("mongoose");
const username=process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = 'mongodb+srv://'+username+':'+password+'@cluster0.rcxfsrf.mongodb.net/?retryWrites=true&w=majority';

const database = mongoose.connect(
  uri,
  { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true
  },
  (error) => {
    if (!error) {
      console.log("connected to the mongoDB");
    } else {
      console.log("connection to mongoDB failed \n" + error);
    }
  }
);

module.exports = database;
