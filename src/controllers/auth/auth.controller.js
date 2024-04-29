const jwt = require("jsonwebtoken");
const {GenerateAccessToken, GenerateRefreshToken} = require("../../utils/generateJWT");
const QueryDatabase = require("../../utils/queryDatabase");
const {compareHashPassword} = require("../../utils/hashBcrypt");
const logger = require("../../loggers/loggers.config");

const Login = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM "user";
    `;
    const data = await QueryDatabase(sql);
    const {email, password} = req.body;
    const findAccount = data.rows.find((item) => item.email === email);

    // Check email
    if (!findAccount) {
      return {code: 401, message: "Email not found"};
    }

    // Compare Password with database
    const checkPassword = await compareHashPassword(password, findAccount.password);
    if (checkPassword === false) {
      return {code: 401, message: "Password is wrong"};
    }

    if (checkPassword === true) {
      const sql_search_role = `SELECT role FROM "user" WHERE email = '${email}'`;
      const role = await QueryDatabase(sql_search_role);

      const accessToken = GenerateAccessToken({user_name: findAccount?.name, role: role.rows[0].role});
      const refreshToken = GenerateRefreshToken({user_name: findAccount?.name, role: role.rows[0].role});
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
  } catch (error) {
    logger.error(error);
    console.error("Internal Server Error 🔥:: ", err);
    return {code: 500, message: "Internal Server Error"};
  }
};

const RefreshToken = async (req, res) => {
  try {
    const authHeaders = req.headers["authorization"];

    if (!authHeaders) {
      return {code: 401, message: "Can not find authorization header"};
    }

    const checkBearer = authHeaders.includes("Bearer");
    if (!checkBearer) {
      return {code: 401, message: "Do not have Bearer"};
    }

    const token = authHeaders.replace("Bearer ", "");
    if (!token) {
      return {code: 401, message: "Unauthorized"};
    }

    const decodedJWT = jwt.decode(token);
    const refresh_token = GenerateRefreshToken({user_name: decodedJWT.user_name, role: decodedJWT.role});
    return {refresh_token: refresh_token};
  } catch (error) {
    logger.error(error);
    return {code: 401, message: "JWT expired"};
  }
};

module.exports = {
  Login,
  RefreshToken,
};
