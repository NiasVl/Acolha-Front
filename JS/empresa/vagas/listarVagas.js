document.addEventListener("DOMContentLoaded", () => {
    carregarVagas();
});

async function carregarVagas() {
    const empresa_id = localStorage.getItem("empresa_id");

    if (!empresa_id) {
        Swal.fire("Erro", "Empresa não encontrada. Faça login novamente!", "error");
        return;
    }

    const container = document.getElementById("listaVagas");
    container.innerHTML = "<p>Carregando vagas...</p>";

    try {

        const resposta = await fetch("http://localhost:3000/acolha/v1/vagas_empresa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empresa_id }),
        });

        const vagas = await resposta.json();
        if (!resposta.ok) throw new Error(vagas.erro);

        if (vagas.length === 0) {
            container.innerHTML = "<p>Nenhuma vaga criada ainda.</p>";
            return;
        }


        const respostaContagem = await fetch("http://localhost:3000/acolha/v1/total_candidatos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empresa_id }),
        });

        const contagem = await respostaContagem.json();


        const vagasMapeadas = vagas.map(v => {
            const infoContagem = contagem.find(c => c.vaga_id === v.id);
            return {
                ...v,
                total_candidatos: infoContagem ? infoContagem.total_candidatos : 0
            };
        });


        container.innerHTML = vagasMapeadas
            .map(v => `
                <div class="profile-card" 
                     style="display: flex; gap: 10px; align-items: center; justify-content: center;">
                    
                    <h3 class="card-title">${v.titulo}</h3>
                    <p class="card-text"><b>Localidade:</b> ${v.local}</p>
                    <p class="card-text"><b>Candidatos:</b> ${v.total_candidatos}</p>

                    <button 
                        type="button" 
                        class="btn btn-warning" 
                        style="color: white" 
                        onclick="verCandidatos(${v.id})">
                        Ver Candidatos
                    </button>
                </div>
            `).join("");

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar vagas.</p>";
    }
}

window.verCandidatos = async function (vaga_id) {
    try {
        const resposta = await fetch(`http://localhost:3000/acolha/v1/candidatos_vaga`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vaga_id }),
        });

        const candidatos = await resposta.json();
        if (!resposta.ok) throw new Error("Erro ao buscar candidatos");

        if (candidatos.length === 0) {
            Swal.fire("Sem candidatos", "Ninguém se candidatou ainda nesta vaga.", "info");
            return;
        }

        const tabela = `
            <table style="width:100%; text-align:center; border-collapse: collapse;" border="1">
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Data</th>
                    <th>Currículo</th>
                </tr>
                ${candidatos.map(c => `
                    <tr>
                        <td>${c.nome}</td>
                        <td>${c.email}</td>
                        <td>${c.telefone}</td>
                        <td>${new Date(c.dataCandidatura).toLocaleString()}</td>
                        <td>
                            <a 
                                href="http://localhost:3000/curriculos/${c.curriculo.split('/').pop()}"
                                target="_blank"
                                class="btn btn-warning"
                                style="color:white"
                            >
                                Abrir PDF
                            </a>
                        </td>
                    </tr>
                `).join("")}
            </table>
        `;

        Swal.fire({
            title: "Candidatos da vaga",
            html: tabela,
            width: "1100px",
            confirmButtonText: "Fechar"
        });

    } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível carregar os candidatos.", "error");
    }
};
;
