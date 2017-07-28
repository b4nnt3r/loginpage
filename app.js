const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

app.use(session({
  secret: '2C44-4D44-WppQ385',
  resave: false,
  saveUninitialized: true
}));


let requirments = {
  'username': 'brandon',
  'password': 'pickles'
}

let auth = function(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    return res.sendStatus(401);
  }
}

app.get('/', function(req, res) {
  if (req.session && req.session.admin) {
    res.redirect('/content');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  if (req.body.username === requirments.username && req.body.password === requirments.password) {
    req.session.admin = true;
    res.redirect('/');
  }
});

app.get('/content', auth, function(req, res) {
  res.render('content')
});

app.post('/logout', function(req, res) {
  req.session.destroy();
  res.render('logout');
});

app.listen(3000, function() {
  console.log('Login app listening on port 3000');
});
