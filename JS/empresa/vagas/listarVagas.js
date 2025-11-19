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
        const resposta = await fetch(`http://localhost:3000/acolha/v1/vagas_empresa`,
        {
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

        if (vagas.total_candidatos === undefined) {
            vagas.forEach(v => v.total_candidatos = 0);
        }

container.innerHTML = vagas
    .map(v => `
        <div class="profile-card" style = "display: flex; gap: 10px; align-items: center; justify-content: center; ">

            <h3 class="card-title"  >${v.titulo}</h3>
            <p class="card-text"><b> localidade:${v.local}</b> </p>
            <p class="card-text"><b>Candidatos:</b> ${v.total_candidatos}</p>

            <button 
                type="button" 
                class="btn btn-warning" 
                style="color: white;" 
                onclick="verCandidatos(${v.id})"
            >
                Ver Candidatos
            </button>
        </div>
    `)
    .join("");


    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar vagas.</p>";
    }
}

window.verCandidatos = async function (vaga_id) {
    // depois vamos criar essa parte
    Swal.fire("OK", "Aqui vamos mostrar os candidatos da vaga " + vaga_id, "info");
};
