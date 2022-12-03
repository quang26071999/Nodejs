const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://quang123:quang123@cluster0.umb30uq.mongodb.net/');

const Image = new mongoose.Schema({
    title: String,
    description : String,
    img: String,
    imgSmall: String,
})

const Images = mongoose.model('Images',Image);



router.get('/image/:page', (req, res, next) => {
    let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page ;

    Images
        .find() // find tất cả các data
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, products) => {
            Images.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
                if (err) return next(err);
                res.render('index', {
                    products: products, // sản phẩm trên một page
                    current: page, // page hiện tại
                    pages: Math.ceil(count / perPage) // tổng số các page
                });
            });
        });
});
router.get('/getImg/:page', (req, res, next) => {
    let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page ;

    Images
        .find() // find tất cả các data
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, products) => {
            Images.countDocuments((err) => { // đếm để tính có bao nhiêu trang
                if (err) return next(err);
                res.json(products);
            });
        });
});



module.exports = router;
