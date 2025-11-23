import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js";

document.addEventListener("DOMContentLoaded", () => {
  carregarSolicitacoesADM();
});

async function carregarSolicitacoesADM() {
  try {
    const res = await fetch("http://localhost:3000/acolha/v1/solicitacao/todas");
    const lista = await res.json();

    lista.sort((a, b) => {
      const aRespondida = a.resposta && a.resposta.trim() !== "";
      const bRespondida = b.resposta && b.resposta.trim() !== "";
      return aRespondida - bRespondida;
    });

    const container = document.querySelector("#cards-container-solicitacoes");
    if (!container) return;

    container.innerHTML = "";

    lista.forEach(s => {
      container.innerHTML += criarCardSolicitacao(s);
    });

    document.querySelectorAll(".btn-acessar").forEach(btn => {
      btn.addEventListener("click", () => {
        abrirSwalSolicitacao(btn.dataset.id);
      });
    });

  } catch (err) {
    console.error("Erro ao carregar solicitações:", err);
  }
}


function criarCardSolicitacao(s) {

  const foiRespondida = s.resposta_admin && s.resposta_admin.trim() !== "";

  return `
    <div class="card" 
         style="
            flex: 1 1 30%; 
            min-width: 260px; 
            border: 2px solid ${foiRespondida ? '#2ecc71' : '#ccc'};
            background: ${foiRespondida ? '#e8fbe8' : 'white'};
        ">
      <div class="card-body">

        <h5 class="card-title">${s.assunto}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">
          Protocolo: ${s.protocolo}
        </h6>
        <p class="card-text">${s.descricao}</p>

        ${
          foiRespondida
            ? `<span class="badge bg-success">Respondida</span>`
            : `
              <button 
                class="btn btn-primary btn-acessar"
                data-id="${s.id}">
                Acessar
              </button>
            `
        }

      </div>
    </div>
  `;
}



async function abrirSwalSolicitacao(idSolicitacao) {
  try {
    const res = await fetch("http://localhost:3000/acolha/v1/solicitacao/todas");
    const lista = await res.json();
    const s = lista.find(x => x.id == idSolicitacao);

    if (!s) {
      return Swal.fire("Erro", "Solicitação não encontrada", "error");
    }

    const dataFormatada = new Date(s.data_criacao).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    Swal.fire({
      title: `<b>${s.assunto}</b>`,
      html: `
        <p><b>Protocolo:</b> ${s.protocolo}</p>
        <p><b>Descrição:</b><br>${s.descricao}</p>
        <p><b>Data:</b> ${dataFormatada}</p>

        <textarea id="respostaADM" class="form-control" 
          placeholder="Digite a resposta aqui..."
          style="margin-top:15px; height:120px"></textarea>

        <button id="btnResponder" class="btn btn-success" style="margin-top:15px">
          Enviar resposta
        </button>
      `,
      showConfirmButton: false,
      width: "650px"
    });

    document.getElementById("btnResponder").addEventListener("click", async () => {
      const resposta = document.getElementById("respostaADM").value;

      if (!resposta.trim()) {
        return Swal.fire("Aviso!", "Digite uma resposta!", "warning");
      }

      await fetch("http://localhost:3000/acolha/v1/solicitacao/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idSolicitacao,
          resposta
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Respondida!",
        text: "A solicitação foi respondida com sucesso."
      }).then(() => location.reload());
    });

  } catch (err) {
    console.error("Erro ao abrir detalhes:", err);
  }
}
