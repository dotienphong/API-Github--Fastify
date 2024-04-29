const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const GetProject = async (req, res, next) => {
  try {
    const sql = `
      SELECT * FROM project;
    `;
    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetProjectById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      return {code: 400, message: "Wrong format uuid"};
    }

    const sql = `
    SELECT * FROM project WHERE id=${"'" + id + "'"}
    `;

    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

const GetProjectByUser = async (req, res, next) => {
  try {
    const email = req.params.email;

    // Kiểm tra xem có truyền vào hay ko
    if (!email) {
      return {code: 400, message: "Not have email, please check email again"};
    }

    const sql = `
      SELECT DISTINCT c.*
      FROM task a INNER JOIN "user" b ON a.user_mail = b.email INNER JOIN project c ON a.project_id = c.id 
      WHERE b.email = ${"'" + email + "'"}
    `;

    const data = await QueryDatabase(sql);
    return data.rows;
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = {
  GetProject,
  GetProjectById,
  GetProjectByUser,
};