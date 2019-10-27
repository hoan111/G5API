/** Express API router for users in get5.
 * @module routes/users
 * @requires express
 * @requires db
 */
var express = require("express");
/** Express module
 * @const
 */
const router = express.Router();
/** Database module.
 * @const
 */

const db = require("../db");

/** GET - Route serving to get all users.
 * @name router.get('/')
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/", function(req, res, next) {
  var sql = "SELECT * FROM user";
  db.query(sql, function(err, rows) {
    if (err) {
      res.status(500).send({ error: "Something failed!" + err });
    }
    res.json(rows);
  });
});

/** GET - Route serving to get one user by database or steam id.
 * @name router.get('/:userid')
 * @memberof module:routes/users
 * @inner
 * @function
 * @param {string} path - Express path
 * @param {number} request.param.userid - The database or steam ID of the user.
 * @param {callback} middleware - Express middleware.
 */
router.get("/:userid", function(req, res, next) {
  userOrSteamID = req.param("userid");
  var sql = "SELECT * FROM user where id = ? OR steam_id = ?";
  db.query(sql, [userOrSteamID, userOrSteamID], function(err, rows) {
    if (err) {
      res.status(500).send({ error: "Something failed!" + err });
    }
    res.json(rows);
  });
});

/** POST - Route serving to insert a user into the database.
 * @name /create
 * @function
 * @memberof module:routes/users
 * @param {number} req.body.steam_id - Steam ID of the user being created.
 * @param {string} req.body.name - Name gathered from Steam. Can be updated.
 * @param {number} req.body.admin - Integer determining if a user is an admin of the system. Either 1 or 0.
 * @param {number} req.body.super_admin - Integer determining if a user is a super admin of the system. Either 1 or 0.
 */
router.post("/create", function(req, res, next) {
  var steamId = req.body.steam_id;
  var steamName = req.body.name;
  var isAdmin = req.body.admin;
  var isSuperAdmin = req.body.super_admin;
  var sql =
    "INSERT INTO user (steam_id, name, admin, super_admin) VALUES (?,?,?,?)";
  db.query(sql, [steamId, steamName, isAdmin, isSuperAdmin], function(
    err,
    result
  ) {
    if (err) {
      res.status(500).send({ error: "Something failed!" + err });
    }
    res.json({ message: "User created successfully" });
  });
});

/** PUT - Route serving to update a user admin privilege in the application.
 * @name /update
 * @function
 * @memberof module:routes/users
 * @param {number} req.body.steam_id - Steam ID of the user being created.
 * @param {number} req.body.admin - Integer determining if a user is an admin of the system. Either 1 or 0.
 * @param {number} req.body.super_admin - Integer determining if a user is a super admin of the system. Either 1 or 0.
 */
router.put("/update", function(req, res, next) {
  var steamId = req.body.steam_id;
  var isAdmin = req.body.admin || 0;
  var isSuperAdmin = req.body.super_admin || 0;
  var sql = "UPDATE user SET admin = ?, super_admin = ? WHERE steam_id = ?";
  db.query(sql, [isAdmin, isSuperAdmin, steamId], function(err, result) {
    if (err) {
      res.status(500).send({ error: "Something failed!" + err });
    }
    res.json({ message: "User created successfully" });
  });
});

module.exports = router;
