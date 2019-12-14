var User = require('../models/User');
var Cat = require('../models/cat.model');
var Product = require('../models/product.model');

// render admin page
module.exports.index = function (req, res) {
    res.render('admin/index', { layout: 'admin/layoutadmin' });
}

// render list categories
module.exports.listCat = async function (req, res) {
    var cats = await Cat.find();
    var countCat = await Cat.countDocuments();
    var page = parseInt(req.query.page) || 1;
    var perPage = 10;
    var start = (page - 1) * perPage;
    var end = page * perPage;
    var totalPage = Math.ceil(countCat / perPage);
    res.render('admin/listcategories', {
        layout: 'admin/layoutadmin',
        cats: cats.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

// add new categories
module.exports.postListCat = function (req, res) {
    var newCat = req.body.newCat;
    var temp = new Cat();
    temp.catName = newCat;
    temp.amount = 0;
    temp.save(function (err, doc) {
        if (!err) {
            res.redirect('/admin/listcategories');
        }
        else {
            console.log("Error during record insertion: " + err);
        }
    });
}

module.exports.get = async function (req, res) {
    var id = req.params.id;
    var cat = await Cat.findById({ _id: id });
    // var products = await Product.find({name: cat.catName});
    res.render('admin/viewCat', {
        layout: 'admin/layoutadmin',
        cat: cat
    });
}

module.exports.listProduct = async function (req, res) {
    var products = await Product.find();
    res.render('admin/listproduct', {
        layout: 'admin/layoutadmin',
        products: products
    });
}

module.exports.listUser = function (req, res) {
    res.render('admin/listuser', { layout: 'admin/layoutadmin' });
}

module.exports.listRequest = function (req, res) {
    res.render('admin/listrequest', { layout: 'admin/layoutadmin' });
}