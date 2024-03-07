import express from "express";
import mysql from "mysql";
import { conn, queryAsync } from "../dbconnect";
import { MoviePostRequest } from "../model/moviePostRequest";
import {
  AllMovieGetResponse,
  MixMovieGetResponse,
  MovieGetResponse,
  PersonGetResponse,
} from "../model/movieGetResponse";

export const router = express.Router();

router.get("/", async (req, res) => {
  // let resultGetMovie: MixMovieGetResponse = {
  //   movie: [],
  //   creator: [],
  //   star: []
  // }

  let sql = "select * from movie";
  let movieResult = await queryAsync(sql);
  let rawMovieResult = JSON.parse(JSON.stringify(movieResult));
  let movieData = rawMovieResult as MovieGetResponse[];

  res.json({ movieData });
});

router.get("/:name", async (req, res) => {
  let name = req.params.name;
  let getAllMovie: AllMovieGetResponse = {
    data: [],
  };

  let sql = "select * from movie where name like ?";

  sql = mysql.format(sql, ["%" + name + "%"]);
  let movieResult = await queryAsync(sql);
  let rawMovieResult = JSON.parse(JSON.stringify(movieResult));

  for (const rawMv of rawMovieResult) {
    let resultGetMovie: MixMovieGetResponse = {
      movie: [],
      creator: [],
      star: [],
    };
    resultGetMovie.movie = rawMv as MovieGetResponse[];

    sql =
      "SELECT person.*, creator.c_pid AS creator_pid, star.s_pid AS star_pid " +
      "FROM person " +
      "LEFT JOIN creator ON person.pid = creator.c_pid " +
      "LEFT JOIN star ON person.pid = star.s_pid " +
      "WHERE creator.c_mid = ? OR star.s_mid = ?";
    sql = mysql.format(sql, [rawMv.mid, rawMv.mid]);

    let combineResult = await queryAsync(sql);
    let rawCombineResult = JSON.parse(JSON.stringify(combineResult));

    for (const row of rawCombineResult) {
      if(row.creator_pid){
        resultGetMovie.creator.push(row);
      }else if (row.star_pid){
        resultGetMovie.star.push(row);
      }
    }
    getAllMovie.data.push(resultGetMovie);
  }

  res.json({ getAllMovie });
});

router.post("/", (req, res) => {
  let movie: MoviePostRequest = req.body;
  let sql =
    "insert into `movie` (`name`, `pic`, `video`, `rate`, `year`, `length`, `genre`, `des`) values (?,?,?,?,?,?,?,?)";

  sql = mysql.format(sql, [
    movie.name,
    movie.pic,
    movie.video,
    movie.rate,
    movie.year,
    movie.length,
    movie.genre,
    movie.des,
  ]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/:mid", (req, res) => {
  let mid = req.params.mid;
  let sql = "delete from movie where mid = ?";
  sql = mysql.format(sql, [mid]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});
