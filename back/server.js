const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webshop",
});

db.connect((err) => {
  if (err) {
    console.error("Adatbázis kapcsolat sikertelen:", err);
  } else {
    console.log("Csatlakozva az adatbázishoz.");
  }
});

// Titkos kulcs a JWT-hez
const SECRET_KEY = "titkoskulcs";

//Termékek lekérése
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Hiba a termékek lekérésekor:", err);
      return res.status(500).json({ message: "Hiba történt a szerveren." });
    }
    res.json(results);
  });
});

//Kosár tartalmának lekérése
app.get("/api/cart", (req, res) => {
  const query = `
    SELECT cart.id AS cartId, products.id, products.name, products.price, products.description
    FROM cart
    JOIN products ON cart.product_id = products.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Hiba a kosár lekérésekor:", err);
      return res.status(500).json({ message: "Hiba történt a szerveren." });
    }
    res.json(results);
  });
});

//Termék hozzáadása a kosárhoz
app.post("/api/cart", (req, res) => {
  const { productId } = req.body;
  const query = "INSERT INTO cart (product_id) VALUES (?)";
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Hiba a kosárhoz adáskor:", err);
      return res.status(500).json({ message: "Hiba történt a szerveren." });
    }
    res.status(200).json({ message: "Termék hozzáadva a kosárhoz." });
  });
});

//Termék eltávolítása a kosárból
app.delete("/api/cart/:id", (req, res) => {
  const cartId = req.params.id;
  const query = "DELETE FROM cart WHERE id = ?";
  db.query(query, [cartId], (err, result) => {
    if (err) {
      console.error("Hiba a törléskor:", err);
      return res.status(500).json({ message: "Hiba történt a szerveren." });
    }
    res.status(200).json({ message: "Termék eltávolítva a kosárból." });
  });
});

//Kosár ürítése
app.delete("/api/cart", (req, res) => {
  const query = "DELETE FROM cart";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Hiba a kosár ürítésekor:", err);
      return res.status(500).json({ message: "Hiba történt a szerveren." });
    }
    res.status(200).json({ message: "A kosár sikeresen ürítve lett." });
  });
});

//Felhasználó regisztráció
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Felhasználónév és jelszó szükséges!" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Hiba történt." });

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "A felhasználónév már foglalt!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Hiba történt a regisztráció során." });

          res.status(201).json({ message: "Regisztráció sikeres!" });
        }
      );
    }
  );
});

//Felhasználó bejelentkezés
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Felhasználónév és jelszó szükséges!" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Hiba történt." });

      if (results.length === 0) {
        return res
          .status(400)
          .json({ message: "Hibás felhasználónév vagy jelszó!" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Hibás felhasználónév vagy jelszó!" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.json({ message: "Sikeres bejelentkezés!", token });
    }
  );
});

//Felhasználónev módosítása
app.put("/profile", (req, res) => {
  const { token, username } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Autentikáció szükséges!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    if (username) {
      db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
          if (results.length > 0) {
            return res
              .status(400)
              .json({ message: "A felhasználónév már foglalt!" });
          }

          db.query(
            "UPDATE users SET username = ? WHERE id = ?",
            [username, userId],
            (err) => {
              if (err)
                return res.status(500).json({ message: "Hiba történt." });
            }
          );
        }
      );
    }

    res.json({ message: "Adatok sikeresen frissítve!" });
  } catch (err) {
    res.status(401).json({ message: "Érvénytelen token!" });
  }
});

//Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});
