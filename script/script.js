const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MENSAGE = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";

function insertParticipant(){
    
    let name = prompt("Qual o seu nome?");
    const promise = axios.post(URL_PARTICIPANTS, {name});

    promise.then((response)=>{
        alert(`Bem vindo ao chat Uol: ${name}`);
    })

    promise.then((err)=>{
        if(err.request.status != 200){
             console.log(`Nome de usuário indisponível, tente novamente`);
        }
    })
}

