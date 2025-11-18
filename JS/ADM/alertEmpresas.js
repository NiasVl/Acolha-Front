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
        console.error("ERRO: div #cards-container não encontrada no HTML");
        return;
    }

    container.innerHTML = ""; // limpa

    empresas.forEach(empresa => {
        const card = document.createElement("div");
        card.classList.add("profile-card");

        card.innerHTML = `
            <img src="../IMG/icone - Copia.png" class="profile-img">
            <h3 class="card-title">${empresa.nomeEmpresa}</h3>
            <p class="card-text">${empresa.CNPJ}</p>
            <button class="btn btn-warning-usuario btn-warning" type="button">Consultar Dados</button>
        `;

        // Quando clicar no botão → abre o SweetAlert com os dados
        card.querySelector("button").addEventListener("click", () => {
            Swal.fire({
                title: `Dados de <h1 style = "color: black"><b>${empresa.nomeEmpresa}</b></h1>`,
                html: `
                    <p><b>Email:</b> ${empresa.emailEmpresa}</p>
                    <p><b>CPF:</b> ${empresa.CNPJ}</p>
                    <p><b>Telefone:</b> ${empresa.telefone}</p>
                    <p><b>Representante:</b> ${empresa.nomeRep}</p>
                    <p><b>Cargo do representante:</b> ${empresa.cargoRep}</p>
                    <p><b>Nicho da empresa:</b> ${empresa.nichoEmpresa}</p>



                `,
                icon: "info",
                confirmButtonText: "Fechar"
            });
        });

        container.appendChild(card);
    });
}
