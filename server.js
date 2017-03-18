const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();


// THE ORDER OF CALLS TO APP.USE HAVE AN IMPORTANCE !!! Ex; if app.use(express.static(__dirname + '/public')) was AFTER maintenance, you cannot access /help.html


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs'); // Set some express-related configurations --> But can configure handlebars from there
app.use(express.static(__dirname + '/public')); // __dirname stores the path of the current directory

// app.use is how you register Middlewares
app.use((req, res, next) => { // next exist to signal to express WHEN your middleware is done.
    // We can do anything we want in this function :
    // We might do a Database request to see if a user is authenticated.
    // If the function is Async, call next to signal it's done!

    // Log the users (by IP) + Make a timestamp for each connection!
    var now = new Date().toString();
    var log = `${now}: ${req.ip} --> ${req.method} ${req.path}`; // ${req.hostname} @ ${req.ip} are YOUR (server) ip and hostname!

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });

    next(); // You can avoid to call next() to never move on to the next piece of middleware!
});

// Uncomment this for maintenance mode !
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });
// app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (message) => { // Can take arguments --> Only args that you pass in object to the template in res.render(...) !!! (not just random text!)
    return message.toUpperCase();
});


app.get('/', (req, res) => {  // request & response
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Matt',
    //     likes: [
    //         'Tomato',
    //         'Cats',
    //         'Piano'
    //     ]
    // });

    res.render('home.hbs', {
        pageTitle: 'Welcome Page',
        welcomeMessage: 'Welcome to my fantastic <b>website</b>, young padawan!', // You cant inject html code! It won't be rendered!
        currentYear: new Date().getFullYear()
    });

});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear()       // THING IS : it also injects this code to partials! --> But, you don't want to be computed for every page (will always be the same) --> hbs.registerHelper
    });
});

app.get('/bad', (req, res) => {
    res.send({
       errorMessage: 'Unable to handle request' 
    });
});

app.listen(port, 'localhost', () => {
    console.log(`Server is up on port ${port}.`)
});

// handlebars header & footer partials! 