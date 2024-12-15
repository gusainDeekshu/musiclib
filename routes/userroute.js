const {Router}=require('express')
const {updatePassword, ListUser, removeuser, loginuser, registeruser, registeruserbyadmin,logoutuser, getdata } = require('../controllers/usercontroller');

const router=Router();
//test
router.get("/getdata",getdata);

//user
router.get("/logout",logoutuser);
router.post("/signup",registeruser);
router.post("/login",loginuser);
router.get("/users",authMiddleware,ListUser);
router.post("/users/add-user",authMiddleware,registeruserbyadmin);
router.delete("/users/:id",authMiddleware,removeuser);
router.put("/users/update-password",authMiddleware,updatePassword);




module.exports=router;