const express = require("express");

const userController = require('../../controllers/user.controller.js')
const router = express.Router();



const verifyAdmin = async (req, res, next) => {
    const requester = req.decoded.email;
    const requesterAccount = await userCollection.findOne({ email: requester });
    if (requesterAccount.role === 'admin') {
        next();
    }
    else {
        res.status(403).send({ message: 'Forbidden' });
    }
}
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
    .get(userController.getAllUser)
    .post(userController.postUser)


router
    .route("/:email")
    /**
    * @api {get} /get single user
    * @apiDescription Get single  users
    * @apiPermission admin
    
    * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
    * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
    */
    .get(userController.getSingleUser)
    .patch(userController.updateSingleUser)

router
    .route("/admin/:email")
    .get(userController.getAAdminINfo)
    .patch(verifyAdmin, userController.makeAdmin)

// .patch(toolsControllers.updateTool)

module.exports = router;
