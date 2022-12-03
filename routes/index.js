const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require("multer");
const sizeOf = require("image-size");
const sharp = require("sharp");
const alert = require("alert");

mongoose.connect('mongodb+srv://quang123:quang123@cluster0.umb30uq.mongodb.net/');

const Image = new mongoose.Schema({
    title: String,
    description : String,
    img: String,
    imgSmall: String,
})

const Images = mongoose.model('Images',Image);

router.get('/', (req, res, next) => {
    let perPage = 6;
    let page = req.params.page || 1 ;

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
router.get('/image/:page', (req, res) => {
    let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1 ;

    Images
        .find() // find tất cả các data
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, products) => {
            Images.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
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



const Storage = multer.diskStorage({
    destination: 'public/images',
    filename: function (req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
});
const upload = multer({
    storage: Storage,
})

router.post('/insertImg',upload.single('img'),function (req, res){
    const description = req.body.description;
    const title = req.body.title;
    const img = req.file.path;
    let imgSmall;
    sizeOf(img, async function (err, dimensions) {
        await sharp(img).resize(Math.round(dimensions.width/2), Math.round(dimensions.height/2)).toFile('./public/images/'+ 're-'+req.file.filename, function(err) {
            if (err) {
                console.error('sharp>>>', err)
            }
            imgSmall= `http://localhost:3000/images/re-${req.file.filename}`
            const img1= new Images({
                description: description,
                title: title,
                img: `http://localhost:3000/images/${req.file.filename}`,
                imgSmall: imgSmall,
            })
            img1.save().then(data => {
                if (data != null) {
                    alert("Them thanh cong");
                    res.redirect('insert');
                } else {
                    console.log("thất bại");
                }
            });
        })

    });
})

router.get('/insert', function (req, res){
    res.render('insert');
})

module.exports = router;
