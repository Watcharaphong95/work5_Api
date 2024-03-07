import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { StarPostRequest } from "../model/starPostRequest";

export const router = express.Router();

router.get('/', (req, res) => {
    // res.json("HELLO");
    conn.query('SELECT * FROM star', (err, result) => {
        if(err){
            res.json(err);
        };
        res.json(result);
    });
});

router.post("/", (req, res) => {
    let id: StarPostRequest = req.body;
  
    let sql = "insert into `star` (`s_mid`, `s_pid`) values (?,?)";
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

router.delete("/:sid", (req, res) => {
  let sid = req.params.sid;
  let sql = 'delete from star where sid = ?';
  sql = mysql.format(sql, [
    sid,
  ]);

  conn.query(sql, (err, result) => {
    if(err) throw err;
    res.status(200).json({ affected_rows: result.affectedRows })
  });
});
