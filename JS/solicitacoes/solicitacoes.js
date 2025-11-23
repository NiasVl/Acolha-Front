import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js";

export async function carregarSolicitacoes(tipo, id) {
  const rota =
    tipo === "user"
      ? "http://localhost:3000/acolha/v1/solicitacao/minhas"
      : "http://localhost:3000/acolha/v1/solicitacao/empresa";

  const body = tipo === "user" ? { usuario_id: id } : { empresa_id: id };

  try {
    const res = await fetch(rota, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const solicitacoes = await res.json();
    const container = document.getElementById("lista-solicitacoes");

    container.innerHTML = "";

    solicitacoes.forEach((s) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style = "width: 20rem; margin-left: 16px; margin-top: 10px;";

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${s.assunto}</h5>

          <h6 class="card-subtitle mb-2 text-body-secondary">
            Nº de Protocolo: ${s.protocolo}
          </h6>

          <p class="card-text">${s.descricao}</p>

          <button class="btn btn-primary verDetalhes" data-id="${s.id}">
            Ver detalhes
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // 🔥 EVENTO DOS BOTÕES VER DETALHES
    document.querySelectorAll(".verDetalhes").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idSolicitacao = btn.getAttribute("data-id");
        localStorage.setItem("solicitacao_id", idSolicitacao);
        abrirDetalhes(idSolicitacao);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar solicitações:", err);
  }
}

async function abrirDetalhes(idSolicitacao) {
  try {
    let role = localStorage.getItem("usuario");
    let token = jwtDecode(localStorage.getItem("dados"));

    let rota = "";
    let reqBody = {};

    if (role === "user") {
      rota = "http://localhost:3000/acolha/v1/solicitacao/minhas";
      reqBody = { usuario_id: token.id };
    } else {
      rota = "http://localhost:3000/acolha/v1/solicitacao/empresa";
      reqBody = { empresa_id: token.id };
    }

    const res = await fetch(rota, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    const lista = await res.json();
    const s = lista.find((x) => x.id == idSolicitacao);

    if (!s) {
      return Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Solicitação não encontrada ou não pertence a você.",
      });
    }

    const dataFormatada = new Date(s.data_criacao).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    let respostaTexto =
      s.resposta_admin && s.resposta_admin.trim() !== ""
        ? `<p><b>Resposta:</b><br>${s.resposta_admin}</p>`
        : `<p style="color:#888"><i>Sem resposta até o momento.</i></p>`;

    Swal.fire({
      title: `<b>${s.assunto}</b>`,
      html: `
        <p><b>Protocolo:</b> ${s.protocolo}</p>
        <p><b>Descrição:</b><br>${s.descricao}</p>
        <p><b>Status:</b> ${s.status}</p>
        <p><b>Data:</b> ${dataFormatada}</p>

        ${respostaTexto}

        <br>
        <button id="btnExcluir" class="btn btn-danger">
          Excluir solicitação
        </button>
      `,
      showConfirmButton: true,
        confirmButtonText: "Fechar",
      width: "650px",
    });



    document.getElementById("btnExcluir").addEventListener("click", async () => {
      Swal.fire({
        icon: "warning",
        title: "Excluir?",
        text: "Essa ação não pode ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await fetch("http://localhost:3000/acolha/v1/solicitacao/excluir", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: idSolicitacao }),
          });

          Swal.fire({
            icon: "success",
            title: "Excluída!",
            text: "A solicitação foi removida.",
          }).then(() => {
            location.reload();
          });
        }
      });
    });

  } catch (err) {
    console.error("Erro ao abrir detalhes:", err);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("dados");

  if (token) {
    let usuario = jwtDecode(token);

    

      localStorage.setItem("usuario",usuario.role)

      console.log(usuario.role)


    carregarSolicitacoes(usuario.role, usuario.id);
  } else {
    console.log("Nenhum token encontrado");
  }
});
