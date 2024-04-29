const logger = require("../../loggers/loggers.config");
const QueryDatabase = require("../../utils/queryDatabase");
const {v4: uuidv4, validate: validateUuid} = require("uuid");

const DeleteTask = async (req, res, next) => {
  try {
    const id = req.body.id;

    // Check có truyền vào id hay ko
    if (!id) {
      return {code: 400, message: "Missing id"};
    }
    // Kiểm tra xem project_id đúng định dạng uuid ko
    const isValidUuid = validateUuid(id);
    if (isValidUuid == false) {
      return {code: 400, message: "Wrong format uuid"};
    }

    // Check id có trong CSDL hay khong
    const checkId = await QueryDatabase(`SELECT * FROM task WHERE id=${"'" + id + "'"}`);
    if (checkId.rowCount === 0) {
      return {code: 400, message: "Task not found"};
    }

    const sql = `
      DELETE FROM task WHERE id=${"'" + id + "'"};
    `;
    await QueryDatabase(sql);
    return {code: 200, message: "Delete task success"};
  } catch (error) {
    logger.error(error);
    return {code: 500, message: "Internal Server Error"};
  }
};

module.exports = DeleteTask;
