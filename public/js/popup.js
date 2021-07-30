"use strict";

let login = document.querySelector(".login");
let einLogin = document.querySelector(".eingelogged");
let container = document.querySelector(".modal-content");

let absatzWelcom = document.querySelector(".header-welcome");
let chatName = document.querySelector(".userName-chat");
let storage = localStorage.getItem("userName");

if(storage) {               // if(storage != null)
    login.style.display = "none";
    einLogin.style.display = "block";
}

let catalog = document.querySelector(".main-menu__item--catalog");

login.addEventListener("click", function(){
    if(container.classList.contains("modal-error")){
        container.classList.remove("modal-error")
    }
    loadContent();
    return false;
});

if(document.querySelector(".home")){
    absatzWelcom.style.display = "block";
} else {
    absatzWelcom.style.display = "none";
};

function loadContent() {
    // AJAX, um HTML-Snippets zu laden
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status != 200) {
            container.textContent = "Oops";
            return;
        }
        // Antwort des Servers liegt als document mit DOM-Zugriff vor
        // können diese über Eigenschaft responseXML des xhr-Objects auslesen
        container.innerHTML = xhr.responseXML.querySelector(".modal-content").innerHTML;
        container.classList.toggle("modal-content-show");
        let showPassword = container.querySelector(".show-password-in");
        let password = container.querySelector("[name=password]");
        let userLogin = container.querySelector("[name=userName]");
        let email = container.querySelector("[name=email]");

        showPassword.onchange = function () {
            if (showPassword.checked) {
                  password.type = 'text';
            } else {
                password.type = 'password';
                }
        };

        
        let name = container.querySelector("[name=userName]");

        name.addEventListener("input",function() {
            newName(name);
            localStorage.setItem("userName",newName(name));
            absatzWelcom.textContent = "Herzlich willkommen " + newName(name) + " zu unserem Online-Shop";
            chatName.textContent = "Willkommen zu unserem Chat, " + newName(name);
        });

        let einLoggen = container.querySelector(".button-enter");

        einLoggen.addEventListener("click", function(event){
            if(!password.value||!userLogin.value&&!email.value){
                event.preventDefault();
                container.classList.add("modal-error");
            }else{
                container.classList.remove("modal-error")    
                container.style.display = "none";
                login.style.display = "none";
                einLogin.style.display = "block";
            }
        });
    };

    xhr.open("GET", "login.html");
    xhr.responseType = "document"; 
    xhr.send();
}

function newName(name) {
    let eingabe = name.value.toLowerCase().trim();
    let firstLetter = eingabe.charAt(0).toUpperCase();
    let restName = eingabe.substring(1);
    eingabe = firstLetter + restName;
    return eingabe;
};

if(storage) {               // if(storage != null)
    absatzWelcom.textContent = "Herzlich wilkommen " + storage + " zu unserem Online-Shop";
    
} else {
    absatzWelcom.textContent = "Herzlich wilkommen zu unserem Online-Shop";
};

if(document.querySelector(".home")) {
    let chat = document.querySelector(".body-chat");
let chatOpen = document.querySelector(".body-chat__open");
let chatRoom = document.querySelector("#chatroom");
let message = document.querySelector(".message");
let sendMessage = document.querySelector(".send-message");



chat.addEventListener("click", function(){
    chat.style.display = "none";
    chatOpen.style.display = "flex";

    if(storage){
        chatName.textContent = "Willkommen zu unserem Chat, " + storage;
    }else{
        chatName.textContent = "Willkommen zu unserem Chat."
    };
    
    let socket = io.connect();
    socket.on("nachricht", str => {
        chatRoom.innerHTML += "<div class='admin_input  chat-input'>" + "<p class='input_text'> <i>Administrator: </i>" + str + "</p>" + "<p class='input_datum'>" + (new Date).toLocaleTimeString() + "</p>" + "</div>";
        chatRoom.scrollTop = chatRoom.scrollHeight;
    });

    socket.on('connect', function () {
		socket.on('message', function (msg) {
			chatRoom.innerHTML += "<div class='client_input  chat-input'>" + "<p class='input_text'> <i>Sie: </i>" + msg + "</p>" + "<p class='input_datum'>" + (new Date).toLocaleTimeString() + "</p>" + "</div>";
            chatRoom.scrollTop = chatRoom.scrollHeight;
		});

		sendMessage.addEventListener("click", function(e) {
				socket.send(message.value);
				message.value = '';
		});	
        message.onkeypress = function(e) {
            if (e.which == '13') {
                socket.send(message.value);
                message.value = '';
            }
    };	
	});

});

window.onkeydown = function(e){
    if(e.which == "27") {
        chat.style.display = "block";
        chatOpen.style.display = "none";
    }
};
}

//Arbeit mit WarenKorb
let korb = document.querySelector(".warenkorb");
let storageZahl = localStorage.getItem("zahl");
let korbPopup = document.querySelector(".submenu-card");

let counter = 0;
let cardZahl = document.querySelector(".card");

let zusammen = 0;

let tabelle = erzeugeTabelle();
tabelle.className = "card-kaufen";

function erzeugeTabelle() {
    let table = document.createElement("table");
    let tabelleBody = document.createElement("tbody");
    table.appendChild(tabelleBody);
    return table;
}

let tableBody = tabelle.querySelector("tbody");

let row;
let tableRow = document.createElement("tr");


let dataStorage = [];
for(let i=0; i<localStorage.length; i++){
    if(localStorage.getItem(localStorage.key(i)).length>30){
        dataStorage.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
}
let rowStorage = "";

if(dataStorage != null){
    for(let j=0; j<dataStorage.length; j++) {
        rowStorage = dataStorage[j];
        console.log("Das ist row", rowStorage);
        tableRow.innerHTML = dataStorage[j];
        //tableBody.appendChild(tableRow);
    }
   tableBody.innerHTML = dataStorage; 
}
console.log("Mein Storage", dataStorage);
console.log(tableBody);

let data = JSON.parse(localStorage.getItem("tbody"));
console.log(data);

if(data){
    tableBody.innerHTML = data;
    tabelle.appendChild(tableBody);
}

let data1 = localStorage.getItem("gesammt");
console.log("data1 " + data1);
console.log("data1 " + typeof(data1));

let gesamt = document.createElement("p");
gesamt.className = "gesammt";

let link = document.querySelector(".order");
link.addEventListener("click", function(){
    //event.preventDefault();
    //console.log("Das ist eine Tabelle" + tabelle);
    //korbPopup.classList.remove("submenu-card-show");
    cardZahl.classList.remove("card--aktive");
    cardZahl.textContent = "leer";
    localStorage.removeItem("row");
    localStorage.removeItem("zahl");
    localStorage.removeItem("gesammt");
    tableBody.innerHTML = "";
    gesamt.innerHTML = "";
})

cardZahl.addEventListener("click", function(event){
    event.preventDefault();
    korb.appendChild(korbPopup);
    korbPopup.classList.toggle("submenu-card-show");
    korbPopup.appendChild(tabelle);
    korb.appendChild(korbPopup);
    //closeHandler();
    
    if(data != null) {
        korbPopup.appendChild(tabelle);
        korb.appendChild(korbPopup);
        gesamt.textContent = "Zusammen: " + data1 + " Euro";
        korbPopup.appendChild(gesamt);
        korbPopup.appendChild(link);
    }else{
    gesamt.textContent = "Zusammen: " + zusammen + " Euro";
    korbPopup.appendChild(gesamt);
    korbPopup.appendChild(link);
}
    
});


if(storageZahl){
    cardZahl.textContent = storageZahl + " Items";
    cardZahl.classList.add("card--aktive");
} 

if(document.querySelector(".page")){
    let kaufen = document.querySelectorAll(".button-hidden");
    let items = document.querySelectorAll(".hit-main__items");
    
    let itemsName = [];
    let bilder = [];
    let preis = [];
    let quantity = [];

    let newItems = [];

    let links = [];

    items.forEach(function(element,i){
        itemsName.push(element.querySelector(".description").textContent);
        bilder.push(element.querySelector(".ice").getAttribute("src"));
        preis.push(element.querySelector(".price").textContent);
        quantity.push(element.querySelector(".quantity--hidden").textContent);

        //für zusatzliche Information
        links.push(element.querySelector(".description"));
    })
    
    kaufen.forEach(function(element,i) {
        element.addEventListener("click", function(event){
            event.preventDefault();
            zahlung(i);       
        });
    });

    if(data){
        let myArray = tabelle.querySelectorAll(".itemsName");
        console.log("myArray " + myArray);
        for(let i=0; i<myArray.length; i++){
            newItems.push(myArray[i].innerHTML);
        };   
    } else{ 
        newItems = [];
    }

    function erzeugeTabelleZeile(close, bild, title, qnt, summe) {
        let tableRow = document.createElement("tr");
        let cell_1 = document.createElement("td");
        cell_1.className = "table-close";
        let cell_2 = document.createElement("td");
        cell_2.className = "bild-item";
        let cell_3 = document.createElement("td");
        cell_3.className = "itemsName";
        cell_3.setAttribute("name", "itemsName")
        let cell_4 = document.createElement("td");
        cell_4.className = "quantity";
        cell_4.setAttribute("name", "quantity")
        let cell_5 = document.createElement("td");
        cell_5.className = "priceCard";
        cell_5.setAttribute("name", "priceCard");
        


        cell_1.appendChild(close);
        cell_2.appendChild(bild);
        cell_3.appendChild(title);
        cell_4.appendChild(qnt);
        cell_4.appendChild(summe);
        cell_5.appendChild(summe);

        tableRow.appendChild(cell_1);
        tableRow.appendChild(cell_2);
        tableRow.appendChild(cell_3);
        tableRow.appendChild(cell_4);
        tableRow.appendChild(cell_5);
        
        tableRow.classList.add("tableRow");
        return tableRow;
    };

  /*   let closeButton;
    closeButton.addEventListener("click", function(){
        this.parentNode.parentNode.remove();
    }) */

    function zahlung(index){
        cardZahl.classList.add("card--aktive");
        let bildItem = document.createElement("img");
        let item = document.createTextNode("");
        let preisItem = document.createTextNode("");
        let korbItem = document.createElement("div");
        let quan = document.createTextNode("");
        //let closeButton = document.createTextNode("x");
        let closeButton = createDeleteButton();
   
        if(newItems.includes(itemsName[index])){
            console.log("includes", itemsName[index]);

            quantity[index] = parseInt(quantity[index])+ 1;
            items[index].querySelector(".quantity--hidden").innerHTML = quantity[index];

            let myNew = [];
            let myName = tabelle.querySelectorAll(".itemsName");
            for(let k=0; k<myName.length; k++){
                myNew.push(myName[k].innerHTML);
            };
            let indexTabelle = myNew.indexOf(itemsName[index]);

            let zahl = parseInt(tabelle.querySelectorAll(".quantity")[indexTabelle].textContent);
            zahl +=1;
            tabelle.querySelectorAll(".quantity")[indexTabelle].textContent = zahl;
           
           
        } else {
            console.log("nicht includes", itemsName[index]);
            newItems.push(itemsName[index]);
            bildItem.src = bilder[index];
            item.textContent = itemsName[index];
            preisItem.className = "price-card";
            preisItem.textContent = preis[index];
            quan.textContent = quantity[index];
            row = erzeugeTabelleZeile(closeButton, bildItem, item, quan, preisItem);

            console.log(row);
            
            tableBody.appendChild(row);
            } 
        
        localStorage.setItem("tbody", JSON.stringify(tableBody.innerHTML));

        if(storageZahl){
            counter = Number(localStorage.getItem("zahl")) + 1;
        } else {
            counter++;
        }

        if(data1){
            let ser = JSON.parse(data1);
            console.log("data1 " + typeof(JSON.parse(data1)));
            zusammen += parseInt(preis[index]);
            gesamt.textContent = "Zusammen: " + (zusammen+parseInt(ser)) + " Euro";
            localStorage.setItem("gesammt",(zusammen+ser));
        }else{
            zusammen += parseInt(preis[index]);
            console.log("Zusammen: " + zusammen);
            gesamt.textContent = "Zusammen: " + zusammen + " Euro";
            localStorage.setItem("gesammt",JSON.stringify(zusammen));
        }
        cardZahl.textContent = counter + " Items";
        localStorage.setItem("zahl", counter);   

        
    }

    function createDeleteButton() {
        let button = document.createElement("button"); //variable, mit der ich elemente referenziere
        button.textContent = "X";
        button.className = "removeItem";
        button.addEventListener("click", function() {
            this.parentNode.parentNode.remove();
            if(data1){
                let ser = JSON.parse(data1);
                zusammen -= parseInt(this.parentNode.parentNode.querySelector(".priceCard").textContent);
                gesamt.textContent = "Zusammen: " + (zusammen+parseInt(ser)) + " Euro";
                localStorage.setItem("gesammt",(zusammen+ser));
            }else{
                console.log(parseInt(this.parentNode.parentNode.querySelector(".priceCard").textContent));
                zusammen -= parseInt(this.parentNode.parentNode.querySelector(".priceCard").textContent);
                gesamt.textContent = "Zusammen: " + zusammen + " Euro";
            }
            if(storageZahl){
                counter = Number(localStorage.getItem("zahl")) - 1;
            } else {
                counter--;
            }
            cardZahl.textContent = counter + " Items";
            localStorage.setItem("zahl", counter); 
        });
        return button; //damit element integriert werden kann. Ohne return Funktion hat keine Rückgabewert
    }
    //Zusatzliche Information mit AJAX
    console.log("Alle Ise", links);
    let containerHits = document.querySelector(".catalog__zeigehits");
    
    let hits;
    
    for(let c=0; c<links.length; c++) {
      links[c].addEventListener("mouseover", function(){
      items[c].appendChild(containerHits);  

        let xhr = new XMLHttpRequest();
        xhr.onload = function(){
            if(xhr.status != 200) return;
            let xml = xhr.responseXML;
            hits = xml.querySelectorAll("hit");
            zeigeHits(c);
            
        }
        xhr.open("GET","description.xml");
        xhr.responseType = "document";
        xhr.send();
      })

      function zeigeHits(count) {
        containerHits.classList.add("catalog__zeigehits--none");
            containerHits.innerHTML = "<h2 class='zeigehits__title'>" + hits[count].querySelector("title").textContent + "</h2>"+ "<p>" + hits[count].querySelector("descr").textContent + "</p>" + "<h2 class='zeigehits__title'>" + hits[count].querySelector("price").textContent + "</h2>" + "<p class='zeigehits__weniger'>" + hits[count].querySelector("zeigen").textContent + "</p>";
            let weniger = document.querySelector(".zeigehits__weniger");
            console.log("weniger", weniger);
            weniger.addEventListener("click",function(){
                console.log("weniger");
                containerHits.classList.remove("catalog__zeigehits--none");
            });
            window.addEventListener("click",function(){
                console.log("weniger");
                containerHits.classList.remove("catalog__zeigehits--none");
            })         
      }
    }

    //Sliders
    let hitsArea = document.querySelectorAll(".hit-main");
    console.log("hitsArea" + hitsArea.length);
    let hitsButtons = document.querySelectorAll(".catalog__button");

    for(let j=0; j<hitsButtons.length; j++){
        hitsButtons[j].addEventListener("click", function(){
            hideHitsBanner();
            changeHitsButton(j);
        });
    }

    function hideHitsBanner() {
        for(let i=0; i<hitsArea.length; i++){
            hitsArea[i].style.display = "none"
            hitsButtons[i].classList.remove("catalog__button--active");
        }
    }

    function changeHitsButton(index) {
        hitsArea[index].style.display = "flex";
        hitsButtons[index].classList.add("catalog__button--active");
    }
    hideHitsBanner();
    changeHitsButton(0);
}


//Sliders
if(document.querySelector(".home")){
    let bannerArea = document.querySelectorAll(".banner-area");
    let buttons = document.querySelectorAll(".banner-area--nonactive");

    for(let j=0; j<buttons.length; j++){
        buttons[j].addEventListener("click", function(){
            hideBanner();
            changeButton(j);
        });
    }

    function hideBanner() {
        for(let i=0; i<bannerArea.length; i++){
            bannerArea[i].style.display = "none"
            buttons[i].classList.remove("banner-area--active");
        }
    }

    function changeButton(index) {
        bannerArea[index].style.display = "flex";
        buttons[index].classList.add("banner-area--active");
    }
    hideBanner();
    changeButton(0);
}











    



