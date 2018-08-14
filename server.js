const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;  //PORT is the environment variable used & set by Heroku automatically

//create new express app
const app = express();

hbs.registerPartials(__dirname + '/views/partials');  //add support for partials
app.set('view engine', 'hbs');  //using the express template engine Handlebars/Mustache for Dynamic websites

app.use((req,res,next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  //console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){ console.log('Unable to append to file'); }
  });
  next();
});

// app.use((req,res,next) => {  //used for when the site is under maintenance/construction
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public')); //use built-in middleware for Static website that doesnt require backend

hbs.registerHelper('getCurrentYear', () => { //HBS helper; used in templates to return data
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

 //setup a handler for HTTP GET request
app.get('/', (req, res) => { //always have the URL start with /
   //res.send('<h1>Hello Express!</h1>');  //what to send back to the browser that made the request
   // res.send({ //NodeJS auto converts objects send as response to JSON.stringify
   //   name: 'Tzvetan',
   //   surname: 'Marinov',
   //   likes: [
   //     'Dancing',
   //     'Hacking'
   //   ]
   // });
   res.render('home.hbs',{  //Template to be used & data to be passed to the template
     pageTitle: 'Home Page',
     welcomeMessage: 'Welcome Tzvetan! Have a nice day!'
   });
});

app.get('/about', (req, res) => { //Template to be used & data to be passed to the template
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle the request.'
  });
});

//bind the App to a port on our machine
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //lets you know the server is up
});
