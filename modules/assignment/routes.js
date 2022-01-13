const router = require("express").Router();
const controller = require("./handler");
const { upload } = require("../../utils/uploads");
const { auth, admin, teacher } = require("../../middleware/auth");
// console.log(upload);

router.get("/", auth, controller.dashboard);
router.post("/submit", auth, upload.single("upload"), controller.submit);
router.get("/results", auth, controller.getAssignments);
router.post("/grade/:id", [auth, teacher], controller.grade);
router.get("/delete/:id", [auth], controller.deleteAssignment);
// router.get("/download", controller.);

module.exports = router;
