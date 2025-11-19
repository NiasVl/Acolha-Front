let emailD = document.getElementById("email");
let senhaD = document.getElementById("senha");
const form = document.getElementById('formLogin');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    Swal.fire({
        title: 'Qual tipo de usuário?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Pessoa Física',
        denyButtonText: 'Pessoa Jurídica',
    }).then((result) => {

        if (result.isConfirmed) {

            
            

            fetch('http://localhost:3000/acolha/v1/login_usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: emailD.value, senha: senhaD.value})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na autenticação');
                }
                return response.json();
            })
            .then(data => {

                localStorage.setItem('dados', data.accessToken);

                if (data.role === 'admin') {
                        swal.fire({
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                });
                
                 setTimeout(() => {
                    window.location.href = 'usuarioADM.html'
                }, 1500);
                } else {
                    swal.fire({
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                });
                
                 setTimeout(() => {
                    window.location.href = 'usuarioPF.html'
                }, 1500);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                swal.fire({
                    icon: "error",
                    title: "Falha no login. Verifique suas credenciais e tente novamente.",
                    showConfirmButton: true
                });
            });

        }

        else if (result.isDenied) {

            
           

            fetch('http://localhost:3000/acolha/v1/login_empresa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: emailD.value, senha: senhaD.value})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na autenticação');
                }
                return response.json();
            })
            .then(data => {

                localStorage.setItem('dados', data.accessToken);
                     
                    if (data){

                        swal.fire({
                            icon: "success",
                            title: "Login realizado com sucesso!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        
                         setTimeout(() => {
                            window.location.href = 'usuarioPJ.html'
                        }, 1500);
                    } else{
                        swal.fire({
                            icon: "error",
                            title: "Erro ao logar. Tente novamente mais tarde.",
                            showConfirmButton: true
                        });
                    }
            })
            .catch(error => {
                console.error('Erro:', error);
                swal.fire({
                    icon: "error",
                    title: "Falha no login. Verifique suas credenciais e tente novamente.",
                    showConfirmButton: true
                });
            });
        }

    }); 
});
