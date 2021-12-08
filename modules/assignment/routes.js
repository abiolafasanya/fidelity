const router = require("express").Router();
const controller = require("./handler");
const {upload} = require("../../utils/uploads");
const auth = require("../../middleware/auth")
const isTeacher = require("../../middleware/teacher")
// console.log(upload);

router.get("/", controller.index);
router.get("/generateTable", controller.createTable);
router.post("/submit", upload.single("upload"), controller.submit);
router.get("/results", controller.getAssignments);
router.post("/grade/:id", [auth, isTeacher], controller.grade);
router.get("/delete/:id", controller.deleteAssignment)
router.get("/download", controller.downloadExcel)
module.exports = router;
