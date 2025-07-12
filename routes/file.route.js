const express = require("express")
const fileController = require("../controllers/file.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router()

router.post("/add-file", fileController.addFile)

module.exports = router