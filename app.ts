import express from "express";
import {router as index} from "./api/index";
import {router as movie} from "./api/movie";
import {router as person} from "./api/person";
import {router as star} from "./api/star";
import {router as creator} from "./api/creator";
import bodyParser from "body-parser";

export const app = express();

// app.use("/", (req, res) => {
//     res.send("HELLO");
// });

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/movie", movie);
app.use("/person", person);
app.use("/star", star);
app.use("/creator", creator);