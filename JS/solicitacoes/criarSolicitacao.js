
const modal = document.getElementById("modalSolicitacao");
const btnAbrir = document.getElementById("btnAbrirForm");
const btnCancelar = document.getElementById("btnCancelarModal");
const btnEnviar = document.getElementById("btnEnviarSolicitacao");

import { carregarSolicitacoes } from "./solicitacoes.js";


btnAbrir.addEventListener("click", () => {
  modal.style.display = "flex";
});

 
btnCancelar.addEventListener("click", () => {
  modal.style.display = "none";
});

 
btnEnviar.addEventListener("click", async () => {
  const assunto = document.getElementById("inputAssunto").value.trim();
  const descricao = document.getElementById("inputDescricao").value.trim();

  if (!assunto || !descricao) {
    swal.fire("Erro", "Preencha todos os campos.", "error");
    return;
  }

 
  const usuarioId = localStorage.getItem("usuario_id");
  const empresaId = localStorage.getItem("empresa_id");

  const body = {
    assunto,
    descricao,
    usuario_id: usuarioId || null,
    empresa_id: empresaId || null
  };

  try {
    const res = await fetch("http://localhost:3000/acolha/v1/solicitacao/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Erro ao criar solicitação");
    }

    swal.fire("Sucesso", "Solicitação criada com sucesso!", "success");

    modal.style.display = "none";

 
    if (usuarioId) {
      carregarSolicitacoes("usuario", usuarioId);
    } else {
      carregarSolicitacoes("empresa", empresaId);
    }

  } catch (err) {
    console.error("Erro ao criar solicitação:", err);
    swal.fire("Erro", "Não foi possível criar a solicitação.", "error");
  }
});
