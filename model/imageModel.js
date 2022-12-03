const mongoose = require('mongoose');
const Image = new mongoose.Schema({
    title: String,
    description : String,
    img: String,
    imgSmall: String,
})

module.exports = Images = mongoose.model('Images',Image);
