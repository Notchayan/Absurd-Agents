import express from "express";
import * as dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app = express()
app.use(express.json());
app.use(session({
    secret: 'helloWorld',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:30*24*60*60 }
  }))


const games = ["wordle", "hangman"];
let dictionary = process.env.DICTIONARY.split("_");

app.post("/dictionary", (req, res) => {
	//accept a json array of words, set dictionary to it
	if (!Array.isArray(req.body)) {
		res.status(400).json("Not an array");
		return;
	}
	dictionary = req.body;
	res.status(200).json("OK");
});

app.get("/", (req, res) => {
	res.json(games);
});

app.get('/h',(req,res)=>{
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

app.listen(3000);