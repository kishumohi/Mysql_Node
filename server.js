import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on http:localhost:${port}`);
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "node_db",
  port: 3306,
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected to Database Successfully!!");
  connection.release();
});

app.get("/products", (req, res) => {
  const sql = "select * from product";
  pool.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/products", (req, res) => {
  const sql = `INSERT INTO product(name,category,brand) values (?,?,?)`;
  const values = [req.body.name, req.body.category, req.body.brand];
  pool.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.patch("/products/:productId", (req, res) => {
  const prodId = Number(req.params.productId);
  const sql = `UPDATE product SET name=?, category=?, brand=? WHERE productId=?`;
  const values = [req.body.name, req.body.category, req.body.brand, prodId];
  pool.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.delete("/products/:productId", (req, res) => {
  const prodId = Number(req.params.productId);
  const sql = `DELETE FROM product WHERE productId=?`;
  pool.query(sql, prodId, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});
