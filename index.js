const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

// Controllers
const articlesController = require("./articles/articlesController");
const categoriesController = require("./categories/categoriesController");
const usersController = require("./users/usersController");

// Models
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');

//View engine
app.set('view engine','ejs');

// Sessions
app.use(session({
    secret: "12t987eibnkrbyf3h48923h0dnib3od03479", cookie: { maxAge: 30000000 }
}))

// Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão realizada com Sucesso!');
    }).catch((error) => {
        console.log(error);
    })

app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index",{articles: articles, categories:categories});
        });
    });
}) 

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article",{article: article, categories:categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(erro => {
        res.redirect("/");
    });
}) 

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories:categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(erro => {
        res.redirect("/");
    });
}) 


app.listen(8080, () => {
    console.log("Servidor está rodando!")
})