const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MENSAGE = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";

let userName = { name: ""};
let chosenUser;
let chosenVisibility;

function insertParticipant() {

    let name = prompt("Escolha um nome de usuário:");
    userName.name = name;
    const requestName = axios.post(URL_PARTICIPANTS, userName);
    
    requestName.then((response)=>{
        alert("Bem-Vindo " + userName.name + "!!!");
    });

    requestName.catch((err)=>{
        const statusCode = err.response.status;
        if (statusCode != 200) {
            alert("Esse nome de usuário já foi escolhido! Tente novamente");
            insertParticipant();
        } 
    });
    menssage();
    searchPaticipants();
}

function keepConnection() {
    const status = axios.post(URL_STATUS, userName);
}

function menssage(){
    const messages = axios.get(URL_MENSAGE);
    messages.then(renderMessages);

}

function renderMessages(response){

    const mensages = document.querySelector(".mensagens");
    mensages.innerHTML = "";
    const data = response.data;
    for(let i = 0; i < data.length; ++i){
        let typeMensege = data[i].type;
        let to = data[i].to;
        let mensage;

        if(typeMensege === "private_message" && userName === to){
            mensage = `<div class="mensage ${typeMensege}">${to}
            <p><span class="time">(${data[i].time})</span>
            <span class="info">${data[i].from} Reservadamente para ${to}:</span>
            <span class="text">${data[i].text}</span>
            </p>
            </div>`
        }else if(typeMensege === "status"){
            mensage = `<div class="mensage ${typeMensege}">
            <p><span class="time">(${data[i].time})</span>
            <span class="info">${data[i].from}</span>
            <span class="text">${data[i].text}</span>
            </p>
            </div>`
        }else{
            mensage = `<div class="mensage ${typeMensege}">
            <p><span class="time">(${data[i].time})</span>
            <span class="info">${data[i].from} <span class="norm">para</span> ${to}:</span>
            <span class="text">${data[i].text}</span>
            </p>
            </div>`
        }

        mensages.innerHTML += mensage;
    }

    const lastMessage = document.querySelector('.mensagens div:last-child');
    lastMessage.scrollIntoView();
}

function sendMensage(){

    let InputMensagem = document.querySelector('#textSend');
    let to = chosenUser.parentNode.querySelector("p").innerHTML;
    let type = chosenVisibility.parentNode.querySelector("p").innerHTML === "Público" ? "message" : "private_message";
 
    infoMensage = { from: userName.name, to: to, text: InputMensagem.value, type: type};
    const response = axios.post(URL_MENSAGE, infoMensage);

    response.then((sucess)=>{
        console.log("mensagem enviada com sucesso");
    });

    response.catch((err)=>{
        const statusCode = err.response.status;
        console.log(statusCode);
        console.log("erro ao enviar mensagem");
        window.location.reload();
    });

    InputMensagem.value = "";
}

function openSideBar(){
    let side = document.querySelector(".side-bar");
    side.classList.toggle("hiden");
}

function hideSideBar(){
    let side = document.querySelector(".side-bar");
    side.classList.toggle("hiden");
}

function messageRecipient(element){

    if(chosenUser) chosenUser.classList.add("hiden");
    chosenUser = element.querySelector(".check");
    chosenUser.classList.remove("hiden");

    if(chosenUser.parentNode.querySelector("p").innerHTML === "Todos"){
        if(chosenVisibility) chosenVisibility.classList.add("hiden");

        chosenVisibility = document.querySelector(".option .check");
        chosenVisibility.classList.remove("hiden");
    }
}

function messageVisibility(element){

    if(chosenUser.parentNode.querySelector("p").innerHTML !== "Todos"){
        if(chosenVisibility) chosenVisibility.classList.add("hiden");
        
        chosenVisibility = element.querySelector(".check");
        chosenVisibility.classList.remove("hiden");
    }
}

function searchPaticipants(){
    const requestParticipants = axios.get(URL_PARTICIPANTS);
    requestParticipants.then(renderParticipants);
}

function renderParticipants(response){

    const users = document.querySelector(".users");
    users.innerHTML = "";
    const data = response.data;
    const defaultOption = `<div class="user" onclick="messageRecipient(this);">
                                <ion-icon name="people"></ion-icon>
                                <p>Todos</p>
                                <ion-icon name="checkmark-outline" class="check hiden" ></ion-icon>
                           </div>`;
    users.innerHTML += defaultOption;
    for(let i = 0; i < data.length; ++i){
        let user = `<div class="user" onclick="messageRecipient(this);">
                        <ion-icon name="person-circle"></ion-icon>
                        <p>${data[i].name}</p>
                        <ion-icon name="checkmark-outline" class="check hiden" ></ion-icon>
                    </div>`;

        users.innerHTML += user;
    }
}

function checkInput(){
    let inputEnter = document.querySelector("#textSend");
    inputEnter.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.querySelector(".confirm-message").click();
        }
    });
}


function initChat(){
    
    insertParticipant();
    setInterval(menssage, 3000); 
    setInterval(keepConnection, 5000);
    setInterval(searchPaticipants, 10000);
    checkInput();
}