const router = require("express").Router();
const controller = require("./handler");
const {upload} = require("../../utils/uploads");
// console.log(upload);

router.get("/", controller.index);
router.get("/generateTable", controller.createTable);
router.post("/submit", upload.single("upload"), controller.submit);
router.get("/results", controller.getAssignments);
router.post("/grade/:id", controller.grade);
router.get("/delete/:id", controller.deleteAssignment)
router.get("/download", controller.downloadExcel)
module.exports = router;
