const express = require("express");
const app = express();
const port = 80;
const path = require("path");

// Express specific stuff
app.use('/static', express.static('static'));
app.use(express.urlencoded());

//pug specific stuff
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//EndPoints for Express App

app.get('/', (req, res) => {
   res.status(200).render('home.pug',{title:'Home'});

});

app.get('/about', (req, res) => {
   res.status(200).render('about.pug',{title:'About'});

});

app.get('/contact', (req, res) => {
   res.status(200).render('contact.pug',{title:'Contact'});

});

app.post('/registration', async(req, res) => {
   //API Call
   let message =  'Your Account succesfully registred';
   let code=200;

   const {name,age,mobileNumber,email,password,cpassword} = req.body;
   if(password === cpassword){
   const response = await fetch("http://localhost:5000/api/auth/createuser", {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({name,age,mobileNumber,email,password})
   });
   const json = await response.json();
   if (!json.success) {
      message = "Sorry! Your Account is not  registred";
      code=401;
   }
}
else{
   message = "Sorry! Your Account is not  registred";
   code=401;
}
   res.status(code).render('registration.pug',{title:'registration',name:req.body.name , message:message});
});

// Listening  Express App

app.listen(port, () => {
   console.log(`Server is listen at http://localhost:${port}`);
});