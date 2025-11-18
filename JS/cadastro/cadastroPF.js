let nome = document.getElementById("nome")
let email = document.getElementById("email")
let senha = document.querySelector(".senha")
let cpf = document.querySelector(".cpf")
let telefone = document.querySelector(".telefone")
let nacionalidade = document.querySelector(".nacionalidade")
let dataNasc = document.querySelector(".dataNasc")


let btn = document.getElementById("btn")



function temMaisDe12Anos(dataNasc) {

  const [ano, mes, dia] = dataNasc.value.split('-').map(Number);

  const hoje = new Date();  
  const nascimento = new Date(ano, mes - 1, dia); // mês é zero-based

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 12;
}

btn.addEventListener('click', () => {

        if(nome.value == "" || email.value == "" || senha.value == "" || cpf.value == "" || telefone.value == "" || nacionalidade.value == "" || dataNasc.value == ""){
            alert("Por favor, preencha todos os campos.")
            return 
        }
        

        let dataUsuario = {
            nome: nome.value,
            email: email.value,
            senha: senha.value,
            nacionalidade: nacionalidade.value,
            cpf: cpf.value,
            telefone: telefone.value,
            dataNasc: dataNasc.value
        }

        console.log(dataUsuario)


        if(temMaisDe12Anos(dataNasc) == true){
            try{
                    fetch("http://localhost:3000/acolha/v1/add_usuarios", {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"  
                        },
                        body: JSON.stringify(dataUsuario) 
                    })
                .then(res => res.json()) // converte a resposta em JSON
                .then(data => {
                    console.log("Resposta do servidor:", data);
                })
                alert("Cadastro realizado com sucesso!")
                setTimeout(() => {
                    window.location.href = "login.html"
                }, 1000); // Redireciona após 2 segundos
                
            
            }
            catch(error){
                console.error("Erro ao enviar dados:", error);
            }
        }
            
         
}) 
