"use strict";

const fs = require("fs");
const express = require("express");
const app = express();
const IP = "127.0.0.1";
const PORT = 8081;

const models = require("./models");

let http = require("http");

let webServer = http.Server(app);

let socketIo = require("socket.io");

let io = socketIo(webServer);


models.sequelize.sync({force: true})
.then( function() {

    app.set("view engine","ejs");
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static("public"));
    
    const data = fs.readFile("products.csv", "UTF8", (error, data) => {
        let products = data.split("\n");
        products.shift(); //entfernen erste Zeile
    
        let pages = products
        .filter(row => row !== "")
        .map(recordsToDB)
        .join("\n");   
    })
    app.post("/login", (req, res) => {
        let Username = req.body.userName;
        let password = req.body.password;
        let email = req.body.login;
        
        models.Datei.bulkCreate([
            {
                Username: Username,
                password: password,
                email: email                   
            }])
        .then(function(obj) {
            console.log(`User name ${Username}`); 
            console.log(obj);
        })
        
    });
       
    app.post("/warenKorb", (req, res) => {
        let item = req.body.item;
        let zahl = req.body.quantity;
        let price = req.body.priceCard;

        models.Corb.bulkCreate([
            {
                item: item,
                zahl: zahl,
                price: price            
            }
        ])
        .then((obj) => {
            console.log(`Das ist dein Objekt ${item}`);
            console.log(obj);
        })
    })

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

    //Ein Chat erzeugen
    
    io.on('connection', (socket) => {
        models.Datei.findAll({ //durch Datenbank durchsuchen
                raw: true,  // nur dataValues zurückgeben
                attributes: ["Username"],//welchen Spalten soolen zurückgegeben werden
        })
        .then((obj) => {
            if(obj == "") {
                console.log(`Neuer User ist undefined: ${socket.id} von ${socket.conn.remoteAddress}`);
            }else{
                console.log(`Neuer User: ${JSON.stringify(obj[0].Username)} von ${socket.conn.remoteAddress}`)
            }
        })
        
        socket.on('message', (data) => {
            models.Datei.findAll({ //durch Datenbank durchsuchen
                raw: true,  // nur dataValues zurückgeben
                attributes: ["Username"],//welchen Spalten soolen zurückgegeben werden
            })
            .then((obj) => {
                if(obj == "") {
                    console.log(`User ${socket.id} schreibt: ${data}`);
                }else{
                    console.log(`User ${JSON.stringify(obj[0].Username)} schreibt: ${data}`);
                }
                //console.log(`User ${socket.id} schreibt: ${data}`);
                io.emit("message", data.toString()) 
            })
        })
    })
        let stdIn = process.stdin;
        stdIn.on("data", d => {
            io.emit("nachricht", d.toString());
            
        });

        
    
        webServer.listen(PORT,IP, () => {
            console.log(`Server rennt auf http://${IP}:${PORT}/`);
        });
    
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