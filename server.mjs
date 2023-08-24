import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
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

app.listen(3000);