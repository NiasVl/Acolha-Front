let email = document.getElementById("email")
let senha = document.getElementById("senha")
let btn = document.querySelector(".btn")
const form = document.getElementById('formLogin');

form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  
    

    let user = {
        email: email.value,
        senha: senha.value
    }

    fetch('http://localhost:3000/acolha/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Erro na autenticação');
        }
    })
    .then(data => {
        
        if(data.role === 'admin'){
            window.location.href = 'usuarioADM.html'; 
            console.log(data.accessToken)
            localStorage.setItem('dados', data.accessToken);
        
        } else {
            window.location.href = '../index.html'; 
            localStorage.setItem('dados', data);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no login. Verifique suas credenciais e tente novamente.');
    });

})