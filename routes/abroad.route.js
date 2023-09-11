const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");

const { StudyAbroadApplication } = require("../controller/abroad.controller");

router.post(
  "/application",
  upload.fields([
    { name: "passport_pic", maxCount: 1 },
    { name: "transcript_doc", maxCount: 1 },
    { name: "id_passport" },
    { name: "vaccine" },
  ]),

  StudyAbroadApplication
);

router.get("/applications", StudyAbroadApplication);

module.exports = router;