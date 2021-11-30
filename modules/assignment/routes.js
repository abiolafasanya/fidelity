const router = require("express").Router();
const controller = require("./handler");
const {upload} = require("../../utils/uploads");
console.log(upload);

router.get("/", controller.home);
router.get("/generateTable", controller.createTable);
router.post("/submit", upload.single("upload"), controller.submit);
router.get("/getData", controller.getAssignments);
module.exports = router;
