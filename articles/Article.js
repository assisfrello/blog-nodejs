const Sequelize = require('sequelize');
const connection = require('../database/database');
const Cateogory = require('../categories/Category');

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },slug:{
        type: Sequelize.STRING,
        allowNull:false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull:false
    }
})

Cateogory.hasMany(Article); //uma categoria tem muitos artigos
Article.belongsTo(Cateogory); //um artigo pertence a uma categoria

//Article.sync({force:true});

module.exports = Article;