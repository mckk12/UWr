var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
let baza = require('./base');
const db = require('mongodb');

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.set('view engine', 'ejs');
app.set('views', './views');

// middleware, który przekazuje do widoków zmienną user
app.use(async (req, res, next) => {
    if (req.signedCookies.user) {
        const users = await baza.wypiszUzytkownikow();
        const user = users.find(u => u.nick === req.signedCookies.user.nick);
        req.user = user;
    }
    next();
});

// strona główna
app.get('/', async (req, res) => {
    const products = await baza.wypiszProdukty();    
    res.render('index', { user: req.user, products });
});

app.get('/logout', (req, res) => {
    res.cookie('user', '', { maxAge: -1 });
    res.redirect('/');
});

// strona logowania
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;
    const users = await baza.wypiszUzytkownikow();
    const user = users.find(u => u.nick === username);
    if (user && user.haslo === pwd) {
        // wydanie ciastka
        res.cookie('user', user, { signed: true });
        // przekierowanie
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl || '/');
        
    } else {
        res.render('login', { message: "Zła nazwa logowania lub hasło", user: req.user });
    }
});
//strona rejestrowania
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;
    const users = await baza.wypiszUzytkownikow();
    const user = users.find(u => u.nick === username);
    if (user) {
        res.render('register', { message: "Podana nazwa jest już zajęta!", user: req.user });    
    } else {
        baza.dodajUzytkownika("zwykly", pwd, username);
        const newUser = { nick: username, haslo: pwd }; 
        // wydanie ciastka
        res.cookie('user', newUser, { signed: true }); 
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl || '/');
    }
});
app.get('/koszyk', async (req, res) => {
    const orders = await baza.wypiszZamowienia();
    const products = await baza.wypiszProdukty();

    const userOrders = orders.filter(o => o.userId === req.user._id);
    console.log(req.user._id);
    console.log(orders);
    console.log(req.user.koszk);
    res.render('cart', { user: req.user, orders: userOrders, products });
});

app.get('/addToCart/:productId', async (req, res) => {
    const productId = req.params.productId;
    const user = req.user;
    await baza.dodajDoKoszyka(user._id, productId);
    res.redirect('/');    
});
app.get('/usun-z-koszyka/:productId', async (req, res) => {
    const productId = req.params.productId;
    const user = req.user;
    await baza.usunZKoszyka(user._id, productId);
    res.redirect('/koszyk');  
});
app.get('/zamow', async (req, res) => {
    await baza.dodajZamowienie(req.user._id, req.user.koszk);
    res.redirect('/koszyk');
});

http.createServer(app).listen(process.env.PORT || 10000)
console.log('started');

// Wywołanie przykładowego użycia
//baza.dodajProdukt(100,"zegarek")
//dodajZamowienie(43943,3223)
//operateOnParsedUsers();
// operateOnParsedProducts();
// operateOnParsedOrders();
//baza.dodajUzytkownika("zwykly","pass","nick")

