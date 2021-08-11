const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MENSAGE = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";

let userName = { name: ""};

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
}

function keepConnection() {
    const status = axios.post(URL_STATUS, userName);
    console.log("matendo conexão")
}

function menssage(){
    const messages = axios.get(URL_MENSAGE);
    messages.then(renderMessages);

}

function renderMessages(response){
    console.log("atualizando mensagens");
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
    console.log("funcionando");
}


function initChat(){
    insertParticipant();
    setInterval(menssage, 3000);    
    setInterval(keepConnection, 5000);
}