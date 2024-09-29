// require all required packages
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const port = 3000;
const app = express();

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

// set middlewares
app.set("view engine", "ejs"); // sets view engine to ejs
app.set("views", path.join(__dirname, "views")); // sets views path to curr dir views

app.use(express.static("public")); // use express.static dir to public
app.use(express.json()); // use express JSON (parse) for all requests
app.use(methodOverride("_method")); // change method of html form to ?_method= 'methodName'
app.use(express.urlencoded({ extended: true })); // use express urlencoded (parse) for all requests
const conString = {
  // connection String
  host: "localhost",
  user: "root",
  database: "instagram",
  password: "090078601Asad",
};
const conn = mysql.createConnection(conString); // create sql connection

// for (let i = 0; i <= 350; i++) {
//   let item = createRandomUser();
//   conn.query(
//     `insert into users(id,name,email,password)VALUES('${item.userId.slice(0,10)}','${item.username}','${item.email}','${item.password.slice(0,10)}')`,
//     (err, result) => {
//       if (result) {
//         console.log('success');
//       } else {
//         console.log('err',err);
//       }
//     }
//   );
// }

// conn.query('truncate table users');
function getAllUsers(req, res) {}
// Now we create RESTful API's for CRUD operations using SQL
// index route
// request GET show all users count
app.get("/", async (req, res) => {
  try {
    conn.query("Select count(id) from users", (err, result) => {
      let users = result;
      res.render("start.ejs", { userCount: users[0]["count(id)"] });
    });
  } catch (err) {
    res.send(err);
  }
});

// GET  show all users data
app.get("/users", async (req, res) => {
  await getUsers(res);
});

// GET NEW USER FORM
app.get("/new", (req, res) => {
  res.render("new.ejs");
});
// GET Update USER FORM
app.get("/update/:id", (req, res) => {
  let id = req.params.id.toString();
  console.log(id);
  try {
    conn.query(`SELECT id,name FROM users WHERE id='${id}'`, (err, result) => {
      if (result) {
        let { id, name } = result[0];
        console.log(id, name);
        res.render("update.ejs", { id, name });
      } else if (err) {
        res.send("ERROR : ", err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// POST New User Route
app.post("/user", (req, res) => {
  let { id, username, email, password } = req.body;
  console.log(id, username, email, password);
  conn.query(
    `INSERT INTO users (id,name,email,password)VALUES(${id},'${username}','${email}','${password}')`,
    (err, result) => {
      if (result) {
        if (result.affectedRows > 1) {
          console.log("User Added..");
        }
      } else if (err) {
        console.log("error occured ");
      }
      res.redirect("/users");

      // if(result.affectedRows > 1){
      //   res.redirect('/users');
      // }
    }
  );
});

// PATCH username for user
app.patch("/user", (req, res) => {
  console.log("patch request received");
  let { id, name } = req.body;
  let data = [name.toString(), id.toString()];
  try {
    conn.query("UPDATE users SET name=? WHERE id= ?", data, (err, result) => {
      if (result) {
        console.log(result);
        res.redirect("/users");
      } else {
        res.render("error.ejs", { err });
      }
    });
  } catch (err) {
    console.log('error 123 = ',err);
  }
});

// delete user route
app.delete("/user/:id", (req, res) => {
  let id = req.params.id;
  try {
    conn.query(`DELETE FROM users WHERE id='${id}'`, (err, result) => {});
  } catch (err) {}
  res.redirect("/users");
});

// create express server on port
app.listen(port, () => {
  console.log("Server started on port ", port);
});

async function getUsers(res) {
  return new Promise((response, rej) => {
    try {
      // conn.connect();
      conn.query("Select * from Users ORDER BY name ASC", (err, result) => {
        // console.log(users);
        response("resolved");
        res.render("home.ejs", { users: result });
      });
    } catch (err) {
      response("error");
      res.send(err);
    } finally {
      // conn.end();
    }
  });
}
