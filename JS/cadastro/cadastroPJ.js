let nomeEmpresa = document.getElementById("nomeEmpresa")
let emailEmpresa = document.getElementById("emailEmpresa")
let senhaEmpresa = document.getElementById("senhaEmpresa")
let cnpjEmpresa = document.getElementById("cnpjEmpresa")
let telefoneEmpresa = document.getElementById("telefoneEmpresa")
let nomeRep = document.getElementById("nomeRepresentante")
let cargoRep = document.getElementById("cargoRepresentante")
let nichoEmpresa = document.getElementById("nichoEmpresa")
let msgToADM = document.getElementById("msgToADM")

let btn = document.getElementById("btnCadastrar")

btn.addEventListener("click", function(){
    
    if(nomeEmpresa.value == "" || emailEmpresa.value == "" || senhaEmpresa.value == "" || cnpjEmpresa.value == "" || telefoneEmpresa.value == "" || nomeRepresentante.value == "" || cargoRepresentante.value == "" || nichoEmpresa.value == "" || msgToADM.value == ""){
        alert("Por favor, preencha todos os campos.")
        return 
    } 

            let dataEmpresa = {
                nome: nomeEmpresa.value,
                email: emailEmpresa.value,
                senha: senhaEmpresa.value,
                cnpj: cnpjEmpresa.value,
                telefone: telefoneEmpresa.value,
                nomeRep: nomeRepresentante.value,
                cargoRep: cargoRepresentante,
                nichoEmpresa: nichoEmpresa.value,
                msg: msgToADM.value
            }

        try{
            fetch("http://localhost:3000/acolha/v1/add_empresa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  
                },
                body: JSON.stringify(dataEmpresa) 
            })
            .then(res => res.json()) // converte a resposta em JSON
            .then(data => {
                console.log("Resposta do servidor:", data);
            })
            alert("Cadastro realizado com sucesso!")
            setTimeout(() => {
                window.location.href = "login.html"
            }, 1000);
                
            
            }
            catch(error){
                console.error("Erro ao enviar dados:", error);
            }
    
        console.log(dataEmpresa)
})