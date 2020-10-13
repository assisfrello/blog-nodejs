const express = require("express");
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
//const { USE } = require("sequelize/types/lib/index-hints");

router.get("/admin/users", (req,res) => {
    User.findAll().then(users => {
        res.render("admin/users/index",{users: users});
    });
});

router.get("/admin/users/create", (req,res) => {
    res.render("admin/users/login");
});

router.post("/users/create", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    User.findOne({where: {email: email}}).then(user => {
        if (user == undefined) {
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch(() => {
                res.redirect("/");
            });
        } else {
            res.redirect('/admin/users/create')
        }
    });
});

router.post("/users/delete",(req,res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)){
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        }else{ //Não for número
            res.redirect("/admin/users");
        }
    }else{ //Valor indefinido
        res.redirect("/admin/users");
    }
});

router.get("/login", (req,res) => {
    res.render("admin/users/login");
});

router.post("/users/authenticate", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password,user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            } else {
                res.redirect('/admin/login');
            }
        } else {
            res.redirect('/admin/login');
        }
    });
});

router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;