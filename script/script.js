const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MENSAGE = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";

let userName = { name: ""};
let infoDescription = {to: "", visibility: ""};
let chosenUser;
let chosenVisibility;

function insertParticipant() {

    const inputName = document.querySelector(".inputName");
    let name = inputName.value;
    userName.name = name;
    const requestName = axios.post(URL_PARTICIPANTS, userName);
    
    requestName.then((response)=>{
        alert("Bem-Vindo " + userName.name + "!!!");
    });

    requestName.catch((err)=>{
        const statusCode = err.response.status;
        if (statusCode != 200) {
            alert("Esse nome de usuário já foi escolhido! Tente novamente");
            location.reload();
        } 
    });

    menssage();
    descriptionMensage();
    searchPaticipants();
    initChat();
}

function keepConnection() {
    const status = axios.post(URL_STATUS, userName);
}

function menssage(){
    const messages = axios.get(URL_MENSAGE);
    messages.then(renderMessages);
}

function renderMessages(response){

    const mensages = document.querySelector(".container");
    mensages.innerHTML = "";
    const data = response.data;

    for(let i = 0; i < data.length; ++i){
        let typeMensege = data[i].type;
        let to = data[i].to;
        let description = "";

        if(typeMensege === "private_message" && userName.name === to){
            description = ` <span class="norm">Reservadamente para </span>${to}<span class="norm">:</span>`;
        }else if(typeMensege !== "status"){
            description = ` <span class="norm">para</span> ${to}<span class="norm">:</span>`;
        }
       
        let mensage = `<div class="mensage ${typeMensege}">
        <p><span class="time">(${data[i].time})</span>
        <span class="info">${data[i].from} ${description}</span>
        <span class="text">${data[i].text}</span>
        </p>
        </div>`
        mensages.innerHTML += mensage;
    }

    const lastMessage = document.querySelector('.container div:last-child');
    lastMessage.scrollIntoView();
}

function sendMensage(){

    let InputMensagem = document.querySelector('.text-send');
    let to = infoDescription.to;
    let type = infoDescription.visibility === "Público" ? "message" : "private_message";
 
    infoMensage = { from: userName.name, to: to, text: InputMensagem.value, type: type};
    const response = axios.post(URL_MENSAGE, infoMensage);

    response.then((sucess)=>{
        console.log("mensagem enviada com sucesso");
    });

    response.catch((err)=>{
        const statusCode = err.response.status;
        alert("erro ao enviar mensagem, inicia o chat novamente");
        window.location.reload();
    });
    InputMensagem.value = "";
}

function openSideBar(){
    let side = document.querySelector(".side-bar");
    side.classList.toggle("hiden");
}

function hideSideBar(){
    descriptionMensage();
    let side = document.querySelector(".side-bar");
    side.classList.toggle("hiden");
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
        let hiden = "hiden"

        if(data[i].name === infoDescription.to) hiden = "";
        if(data[i].name !== "Todos"){
            let user = `<div class="user" onclick="messageRecipient(this);">
                            <ion-icon name="person-circle"></ion-icon>
                            <p>${data[i].name}</p>
                            <ion-icon name="checkmark-outline" class="check ${hiden}" ></ion-icon>
                        </div>`;

            users.innerHTML += user;
        }
    }
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
    if(chosenUser && chosenUser.parentNode.querySelector("p").innerHTML === "Todos") return;
    if(chosenVisibility) chosenVisibility.classList.add("hiden");
    
    chosenVisibility = element.querySelector(".check");
    chosenVisibility.classList.remove("hiden");
}

function checkEnter(element){
    element.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            element.parentNode.querySelector(".send").click();
        }
    });
}

function descriptionMensage(){
    let description = document.querySelector(".message-description");
    let to = "Todos";
    let visibility = "Público";

    if(chosenUser !== undefined){
        let user = chosenUser.parentNode.querySelector("p").innerHTML;
        to = user;
        if (chosenVisibility !== undefined)  visibility = chosenVisibility.parentNode.querySelector("p").innerHTML, description.innerHTML = `Enviando para ${user} (${visibility})`;
        else description.innerHTML = `Enviando para ${user} (Público)`;
    }else{
        description.innerHTML = `Enviando para Todos (Público)`;
    }

    infoDescription.to = to;
    infoDescription.visibility = visibility;
}

function enterChat(){
    document.querySelector(".inputName").classList.add("hiden");
    document.querySelector(".confirm-button").classList.add("hiden");
    document.querySelector(".loading").classList.toggle("hiden");
  
    setTimeout(()=>{
        document.querySelector(".menu").classList.add("hiden");
        insertParticipant();
    },2000);
}

function initChat(){
    setInterval(menssage, 3000); 
    setInterval(keepConnection, 5000);
    setInterval(searchPaticipants, 10000);
}

