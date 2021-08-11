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

function initChat(){
    insertParticipant();
    setInterval(keepConnection, 5000);
}