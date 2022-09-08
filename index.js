const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const { body, validationResult } = require('express-validator')
app.set('view engine', 'pug');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/finalDB', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
const books = []
const newbooks = []

db.on('error', function(err) {
    console.log(err)
})

db.on('open', function() {
    app.listen(3010)
    console.log('Iam Open')
})

const shopSchema = new mongoose.Schema({
    Author: String,
    bookName: String,
    link: String,
    NumberOfItems: Number,
    Price: Number
})

const Shop = mongoose.model('Shop', shopSchema)


app.get('/', function(req, res) {
    res.render('final-main');

})

app.get('/mid', function(req, res) {
    if (req.query.un == 'admin' && req.query.pass == '123') {
        res.redirect('/admin');
    } else {
        res.redirect('/user');
    }
})

app.get('/admin', function(req, res) {
    Shop.find(function(err, books) {
        if (err) {
            console.log(err)
        }
        res.render('final-admin', { books: books });
    })
})

app.post('/adminHelp',
    body('Author').isAscii(),
    body('bookName').isAscii(),
    body('NumberOfItems').isNumeric(),
    body('Price').isNumeric(),
    function(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.send(errors.array());
        }
        Author = req.body.Author;
        link = req.body.URL;
        bookName = req.body.bookName;
        NumberOfItems = req.body.NumberOfItems;
        Price = req.body.Price;
        const newBook = new Shop({
            Author,
            bookName,
            link,
            NumberOfItems,
            Price
        })
        newBook.save(function(resullt, err) {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin');
        })
    })

app.get('/user', function(req, res) {
    Shop.find(function(err, books) {
        if (err) {
            console.log(err)
        }
        res.render('final-user', { books: books });
    })
})

app.get('/carthelp', function(req, res) {
    const id = req.query.id;
    console.log(id)
    Shop.findOne({ _id: id }, function(err, book) {
        if (err) {
            console.log(err)
        }
        newbooks.push(book)
    })
    res.redirect('/user');
})

app.get('/cart', function(req, res) {
    res.render('final-cart', { newbooks: newbooks });
})

app.get('/congrats', function(req, res) {
    res.render('final-congrats');
})
