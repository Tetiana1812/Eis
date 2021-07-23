"use strict";

const fs = require("fs");
const express = require("express");
const app = express();
const IP = "127.0.0.1";
const PORT = 8081;

let userdata;

const models = require("./models");

models.sequelize.sync({force: true})
.then( function() {
 
    models.Datei.bulkCreate([
        {
            Username: "jessy",
            password: "1111",
            email: "ttttt@gmail.com",
            idNummer: 1
        }
    ])

    const data = fs.readFile("products.csv", "UTF8", (error, data) => {
        let products = data.split("\n");
        products.shift(); //entfernen erste Zeile
    
        let pages = products
        .filter(row => row !== "")
        .map(recordsToDB)
        .join("\n"); 
    
        
    })
    
        app.set("view engine","ejs");
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static("public"));

        app.post("/login", (req, res) => {
            let Username = req.body.name;
            let password = req.body.password;
            let email = req.body.login;

            models.Datei.findAll({
                raw: true, // nur dataValues zurückgeben
                attributes: ["id","Username","password", "email", "idNummer"],
                where: {
                    Username: Username,
                    password: password,
                    email: email                   
                }
            })
            .then(function(obj) {
                console.log(obj); 
                app.get("/", (req, res) => {
                    models.Datei.findAll({
                        raw: true,
                        attributes: ["Username"]
                    })
                    .then((obj) => {
                        res.render("index", {product: obj})
                    });
            })
        })
        });
        
        app.get("/product/:ix", (req, res) => {
        // sicherstellen, dass es sich bei Parameter um Dezimalzahl handelt, bevor wir auf DB zugreifen
            let aktId = parseInt(req.params.ix,10);
            if(!aktId) {
                res.end("ERROR");
            } else {
                models.Product.findAll({ //durch Datenbank durchsuchen
                    raw: true,  // nur dataValues zurückgeben
                    attributes: ["id","name","desc","price"],//welchen Spalten soolen zurückgegeben werden
                    where: {
                        id: aktId
                    }
                })
                .then(function(obj) {//ergebniss nehmen als obj
                    res.render("product", {product: obj[0]});
                });
            }
        });

        app.get("/catalog", (req,res) => {
            models.Product.findAll({
                raw: true,
                attributes: ["id","name", "price"]
            })
            .then((obj) => {
                res.render("catalog", {product: obj})
            });
        });

        app.get("/", (req,res) => {
            
                res.render("index");
            
        });

        app.listen(PORT,IP,() => {
            console.log(`Server rennt auf http://${IP}:${PORT}/`);
        })
    
})

let recordsToDB = record => {
    const fields = record.split(";")
    .map(page => page.replace("\"",""));//mit Zielarray weiter arbeiten

    models.Product.create({
        name:       fields[0],
        desc:       fields[1],
        price:      fields[2]
    })
    .then( function(obj) {
        
    })
}
