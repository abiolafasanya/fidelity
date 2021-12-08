const router = require("express").Router();
const controller = require("./handler");
const { upload } = require("../../utils/uploads");
const { auth, admin, teacher } = require("../../middleware/auth");
// console.log(upload);

router.get("/", auth, controller.index);
router.get("/generateTable", controller.createTable);
router.post("/submit", auth, upload.single("upload"), controller.submit);
router.get("/results", auth, controller.getAssignments);
router.post("/grade/:id", [auth, teacher], controller.grade);
router.get("/delete/:id", [auth, admin], controller.deleteAssignment);
router.get("/download", controller.downloadExcel);

module.exports = router;
