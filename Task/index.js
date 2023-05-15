const express = require('express');
const mongoose = require('mongoose');
const route = require("./src/routes/route")
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://kanil485333:anil1998@cluster0.t1bdlka.mongodb.net/taskmanagerapp"
    ,{ useNewUrlParser: true })
    .then(() => console.log('Mongodb is connected'))
    .catch(err => console.log(err))

 app.use('/', route);

app.listen(3000, () => {
    console.log('App running on Port')
});
