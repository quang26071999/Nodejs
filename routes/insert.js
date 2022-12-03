
const multer = require("multer");
const  Images = require('../model/imageModel');
const sharp = require('sharp');
const sizeOf = require('image-size');
const alert = require('alert');

function insert(router){

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
}

module.exports = insert;
