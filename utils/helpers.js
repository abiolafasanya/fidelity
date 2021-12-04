const ip = require("public-ip");
const {Parser} = require('json2csv')

exports.serverErrorHandler = async (err, req, res, next) =>
  res.status(500).render("error", {
    errorMessage: err.message,
    stack: err.stack,
    ip: await ip.v4(),
  });

exports.notFoundErrorHandler = async (req, res, next) =>
  res.status(404).render("404", { path: req.path, method: req.method });


exports.downloadResource = async (res, fileName, fields, data) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(csv);
}
