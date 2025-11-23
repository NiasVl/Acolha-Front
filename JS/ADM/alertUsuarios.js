document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarios();
});



async function carregarUsuarios() {
    try {
        const resposta = await fetch("http://localhost:3000/acolha/v1/buscar_usuarios");
        const usuarios = await resposta.json();
        console.log(usuarios);
        gerarCards(usuarios);
        
    } catch (erro) {
        console.error("Erro ao buscar usuários:", erro);
    }
}

function formatarDataISO(isoString) {
    const data = new Date(isoString);

    const dia = String(data.getUTCDate()).padStart(2, "0");
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const ano = data.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
}


function gerarCards(usuarios) {
    const container = document.getElementById("cards-container-usuarios");

    if (!container) {
        console.error("ERRO: div #cards-container não encontrada no HTML");
        return;
    }

    container.innerHTML = ""; 

    usuarios.forEach(usuario => {
        const card = document.createElement("div");
        card.classList.add("profile-card");

        card.innerHTML = `
            <img src="../IMG/icone - Copia.png" class="profile-img">
            <h3 class="card-title">${usuario.nome}</h3>
            <p class="card-text">${usuario.nacionalidade}</p>
            <button class="btn btn-warning-usuario btn-warning" type="button">Consultar Dados</button>
        `;

 
        card.querySelector("button").addEventListener("click", () => {
            Swal.fire({
                title: `Dados de <h1 style = "color: black"><b>${usuario.nome}</b></h1>`,
                html: `
                    <p><b>Email:</b> ${usuario.email}</p>
                    <p><b>Telefone:</b> ${usuario.telefone}</p>
                    <p><b>CPF:</b> ${usuario.CPF}</p>
                    <p><b>Nacionalidade:</b> ${usuario.nacionalidade}</p>
                    <p><b>Data de Nascimento:</b> ${formatarDataISO(usuario.dataNasc)}</p>

                `,
                icon: "info",
                showDenyButton: true,
                confirmButtonText: "Fechar",
                denyButtonText: `Excluir Usuário`,
                
            })
            .then((result) => {
                if (result.isDenied) {
                    fetch(`http://localhost:3000/acolha/v1/delete_usuario`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: usuario.id })
                    })
        
                    .then(response => {
                        if (response.ok) {
                            Swal.fire('Usuário excluído com sucesso!', '', 'success');
                            carregarUsuarios();  
                        } else {
                            Swal.fire('Erro ao excluir usuário.', '', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao excluir usuário:', error);
                        Swal.fire('Erro ao excluir usuário.', '', 'error');
                    });
                }
            });
        }); 


        container.appendChild(card);
    });
}
