document.addEventListener("DOMContentLoaded", () => {
    carregarEmpresas();
});

async function carregarEmpresas() {
    try {
        const resposta = await fetch("http://localhost:3000/acolha/v1/buscar_empresas");
        const empresas = await resposta.json();
        console.log(empresas);
        gerarCards(empresas);
    } catch (erro) {
        console.error("Erro ao buscar empresas:", erro);
    }
}

function gerarCards(empresas) {
    const container = document.getElementById("cards-container-empresas");

    if (!container) {
        console.error("ERRO: div #cards-container-empresas não encontrada no HTML");
        return;
    }

    container.innerHTML = "";

    empresas.forEach(empresa => {
        const card = document.createElement("div");
        card.classList.add("profile-card");

        card.innerHTML = `
            <img src="../IMG/icone - Copia.png" class="profile-img">
            <h3 class="card-title">${empresa.nomeEmpresa}</h3>
            <p class="card-text">${empresa.CNPJ}</p>
            <button class="btn btn-warning-usuario btn-warning" type="button">Consultar Dados</button>
        `;

        card.querySelector("button").addEventListener("click", () => {

            let botaoAprovacao = empresa.is_aproved === 0 
                ? `<button id="aprovarBtn" class="swal2-confirm swal2-styled" style="background-color:#28a745; margin-top:15px;">Aprovar Empresa</button>`
                : `<p style="color:green; font-weight:bold; font-family:'monospaced'; font-size: 26px; margin-top:15px;">Empresa Aprovada</p>`;

            Swal.fire({
                title: `<h2 style="color:black"><b>${empresa.nomeEmpresa}</b></h2>`,
                html: `
                    <p><b>Email:</b> ${empresa.emailEmpresa}</p>
                    <p><b>CNPJ:</b> ${empresa.CNPJ}</p>
                    <p><b>Telefone:</b> ${empresa.telefone}</p>
                    <p><b>Representante:</b> ${empresa.nomeRep}</p>
                    <p><b>Cargo do representante:</b> ${empresa.cargoRep}</p>
                    <p><b>Nicho da empresa:</b> ${empresa.nichoEmpresa}</p>
                    ${botaoAprovacao}
                `,
                icon: "info",
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: "Fechar",
                denyButtonText: "Deletar Empresa",
            })
            .then((result) => {
                if (result.isDenied) {
                    fetch(`http://localhost:3000/acolha/v1/delete_empresa`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: empresa.id}) 
                    })
                    .then((response) => { 
                if (response.ok) {
                    Swal.fire('Empresa excluída com sucesso!', '', 'success');
                    carregarEmpresas(); 
                } else {
                    Swal.fire('Erro ao excluir empresa.', '', 'error');
                }
            })
                    
                }
            }) 
            
            
    

            setTimeout(() => {
                const btn = document.getElementById("aprovarBtn");
                if (btn) {
                    btn.addEventListener("click", async () => {
                        await aprovarEmpresa(empresa.id);
                    });
                }
            }, 100);
        });

        container.appendChild(card);
    });
}

async function aprovarEmpresa(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/acolha/v1/aprovar_empresa`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id: id })
        });

        if (!resposta.ok) throw new Error("Erro ao aprovar empresa");

        Swal.fire({
            icon: "success",
            title: "Empresa Aprovada!",
        });

        carregarEmpresas();

    } catch (erro) {
        console.error("Erro ao aprovar empresa:", erro);
        Swal.fire({
            icon: "error",
            title: "Erro ao aprovar empresa."
        });
    }
}
