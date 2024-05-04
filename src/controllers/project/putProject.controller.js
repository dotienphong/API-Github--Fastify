const escape = require("escape-html");
const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const PutProject = async (req, res, next) => {
  try {
    const name = escape(req.body.name);
    const payment = escape(req.body.payment);
    const time_start = escape(req.body.time_start);
    const time_end = escape(req.body.time_end);
    const note = escape(req.body.note);
    const priority = escape(req.body.priority);
    const id = escape(req.body.id);

    // Check có truyền vào id hay ko
    if (!id) {
      return {code: 400, message: "Missing id"};
    }
    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      return {code: 400, message: "Wrong format uuid"};
    }

    const sql = `
      UPDATE project 
      SET name =  '${name}', 
      payment =  '${payment}', 
      time_start = '${time_start}', 
      time_end = '${time_end}', 
      note = '${note}', 
      priority = '${priority}'
      WHERE id =  '${id}'
    `;
    await QueryDatabase(sql);
    return {code: 200, message: "Update project success"};
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = PutProject;
