const express = require("express");
const orderController = require("../../controllers/order.controller.js")
const router = express.Router();


router
    .route("/")
    /**
     * @api {get} /get All user
     * @apiDescription Get all the users
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}         [page=1]     List page
     * @apiParam  {Number{1-100}}      [limit=10]  Users per page
     *
     * @apiSuccess {Object[]} all the users.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(orderController.getAllOrder)
    .post(orderController.addAOrder)
router
    .route("/:id")
    .delete(orderController.deleteOrder)
router
    .route("/:email")
    .get(orderController.getOrderByEmail)


module.exports = router;
