"use strict";

// Modul einbinden in Klasse
const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize({
    dialect:    "sqlite",
    storage:    __dirname + "./../userName.sqlite"
});


// Model definieren
// = Grundlage für Erzeugung einer DB-Tabelle

let Datei = sequelize.define("product", {
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
    Datei:    Datei
};