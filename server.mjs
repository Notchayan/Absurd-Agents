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
    cookie: {maxAge:24*60*60}
  }))

/*
session details:
object:
{
	...req.session
	game: wordle/hangman/etc.,
	solution: word,
	previous_tries: [
		{
			attempt: word/letter (a string either way),
			data: *depends on game*
			e.g. hangman: attempt = letter, data = array of positions in word (-1 if absent)
			e.g. wordle: attempt = word, data = array of 5 numbers - 0 -> no match, 1 -> wrong position, 2 -> right position - for each letter
		}
	]
}

after an attempt sent to backend:
finds result of attempt e.g. letter - correct or wrong
appends to previous tries
return either result of latest attempt or array of all attempts/results

sending an attempt:
simply post request with attempted word/letter in body

pathway:
initially: no game set, session.game = none, everything else deleted
*/

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

//debug function to print session for every request
app.use((req, res, next) => {console.log(req.session); next();});

app.get("/", (req, res) => {
	req.session.game = "none";
	for (const key in Object.keys(req.session)) {
		if (key === "cookie") continue;
		del req.session[key];
	}
	console.log(req.session);
	res.json(games);
});


app.post("/", (req, res) => {
	if (req.session.game === "none") {
		//no game started yet, so req should be one
		//one of the words from the array games - if
		//it isn't then return error and do nothing
		if (!games.includes(req.body)) {
			res.status(400).json("No such game");
			return;
		}
		req.session.game = req.body;
		//set up game object in session
		//pick a random word
		req.session.solution = dictionary[Math.floor(Math.random()*dictionary.length)];
		req.session.previous_tries = [];
		res.status(200).json("Success");
		return;
	}
	switch (req.session.game) {
		case "wordle":
			break;
		case "hangman":
			break;
	}
})

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

app.listen(8000);