import express from "express";
import mysql from "mysql";
import { conn, queryAsync } from "../dbconnect";
import { MoviePostRequest } from "../model/moviePostRequest";
import { MixMovieGetResponse, MovieGetResponse, PersonGetResponse } from "../model/movieGetResponse";

export const router = express.Router();

router.get("/:name", async (req, res) => {
  let name = req.params.name;
  let resultGetMovie: MixMovieGetResponse = {
    movie: [],
    creator: [],
    star: [],
  };
  let star: PersonGetResponse;
  let sql = 'SELECT * FROM movie WHERE name like ?';
  sql = mysql.format(sql, [
    "%" + name + "%",
  ]);

  let movieResult = await queryAsync(sql);
  let rawMovieResult = JSON.parse(JSON.stringify(movieResult));
  resultGetMovie.movie = rawMovieResult as MovieGetResponse[];

  sql = 'select * from person where pid in (select c_pid from creator where c_mid = ?)';
  sql = mysql.format(sql, [
    resultGetMovie.movie[0].mid,
  ]);

  let creatorResult = await queryAsync(sql);
  let rawCreatorResult = JSON.parse(JSON.stringify(creatorResult));
  resultGetMovie.creator = rawCreatorResult as PersonGetResponse[];

  sql = 'select * from person where pid in (select s_pid from star where s_mid = ?)';
  sql = mysql.format(sql, [
    resultGetMovie.movie[0].mid,
  ]);

  let starResult = await queryAsync(sql);
  let rawStarResult = JSON.parse(JSON.stringify(starResult));
  resultGetMovie.star = rawStarResult as PersonGetResponse[];

  res.json({ resultGetMovie });

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
    if(err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete('/:mid', (req, res) => {
    let mid = req.params.mid;
    let sql = 'delete from movie where mid = ?';
    sql = mysql.format(sql, [
        mid,
    ]);

    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.status(200).json({ affected_row: result.affectedRows });
    });
});