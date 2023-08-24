import express from "express";
import * as dotenv from "dotenv";
import session from "express-session";

const app = express()
const port = process.env.PORT || 3000

app.use(session({
    secret: 'helloWorld',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:30*24*60*60 }
  }))


app.get('/',(req,res)=>{
    console.log(req.session.views);
    if (req.session.views) {
        res.send('You are logged in')
    } else {
        res.send('You are not logged')
        req.session.views=1
        console.log(req.session.views);
        req.session.save()
    }
})


app.listen(port,()=>{console.log(`Listening on Port ${port}`);})
