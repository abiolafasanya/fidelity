const router = require("express").Router();
const controller = require("./handler");
const {upload} = require("../../utils/uploads");
// console.log(upload);

router.get("/", controller.index);
router.get("/generateTable", controller.createTable);
router.post("/submit", upload.single("upload"), controller.submit);
router.get("/results", controller.getAssignments);
router.get("/delete/:id", controller.deleteAssignment)
module.exports = router;
