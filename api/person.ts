import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { PersonPostRequest } from "../model/personPostRequest";

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

router.post("/", (req, res) => {
  let person: PersonPostRequest = req.body;
  let sql =
    "insert into `person` (`name`, `pic`, `des`,`age`) values (?,?,?,?)";
  sql = mysql.format(sql, [person.name, person.pic, person.des, person.age]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/:pid", (req, res) => {
    let pid = req.params.pid;
    let sql = 'delete from person where pid = ?';
    sql = mysql.format(sql, [
        pid,
    ]);

    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.status(200).json({ affected_row: result.affectedRows });
    });
});