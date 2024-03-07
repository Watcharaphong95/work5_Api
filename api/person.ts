import express from "express";
import mysql from "mysql";
import { conn, queryAsync } from "../dbconnect";
import { PersonPostRequest } from "../model/personPostRequest";
import { PersonGetResponse } from "../model/movieGetResponse";

export const router = express.Router();

router.get("/", (req, res) => {
  // res.json("HELLO");
  conn.query("SELECT * FROM person", (err, result) => {
    if (err) {
      res.json(err);
    }
    res.json(result);
  });
});

router.get("/name/:name", (req, res) => {
  let name = req.params.name;
  let sql = "select * from person where name like ?";
  sql = mysql.format(sql, ["%" + name + "%"]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ result });
  });
});

router.post("/", async (req, res) => {
  let person: PersonPostRequest = req.body;

  let sql = "select * from person where name = ?";
  sql = mysql.format(sql, [person.name]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    if (result != "") {
      res.status(200).json("This person already in database");
    } else {
      sql =
        "insert into `person` (`name`, `pic`, `des`,`age`) values (?,?,?,?)";
      sql = mysql.format(sql, [
        person.name,
        person.pic,
        person.des,
        person.age,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res
          .status(201)
          .json({
            affected_row: result.affectedRows,
            last_idx: result.insertId,
          });
      });
    }
  });
});

router.delete("/:pid", (req, res) => {
  let pid = req.params.pid;
  let sql = "delete from person where pid = ?";
  sql = mysql.format(sql, [pid]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});
