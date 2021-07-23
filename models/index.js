"use strict";

// Modul einbinden in Klasse
const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize({
    dialect:    "sqlite",
    storage:    __dirname + "./../database.sqlite"
});


// Model definieren
// = Grundlage für Erzeugung einer DB-Tabelle

let Product = sequelize.define("product", {
    name: {
        type:   DataTypes.STRING,
       
    },
    desc: {
        type:   DataTypes.TEXT
    },
    price:  {
        type:   DataTypes.NUMBER
    }
});

let Datei = sequelize.define("userName", {
    Username: {
        type:   DataTypes.STRING,
       
    },
    password: {
        type:   DataTypes.STRING
    },
    email:  {
        type:   DataTypes.STRING
    },
    idNummer: {
        type:   DataTypes.NUMBER
    }
});

module.exports = {
    sequelize:  sequelize,
    Product:    Product,
    Datei: Datei
};