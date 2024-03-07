import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { CreatorPostRequest } from "../model/creatorPostRequest";

export const router = express.Router();

router.get("/", (req, res) => {
  // res.json("HELLO");
  conn.query("SELECT * FROM creator", (err, result) => {
    if (err) {
      res.json(err);
    }
    res.json(result);
  });
});

router.post("/", (req, res) => {
  let id: CreatorPostRequest = req.body;

  let sql = "insert into `creator` (`c_mid`, `c_pid`) values (?,?)";
  sql = mysql.format(sql, [
    id.mid,
    id.pid
  ]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/", (req, res) => {
    let mid = req.query.mid;
    let pid = req.query.pid;
    
    let sql = 'delete from creator where c_mid = ? AND c_pid = ?';
    sql = mysql.format(sql, [
        mid,
        pid
    ])

    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.status(200).json({ affected_rows: result.affectedRows })
    });
})
