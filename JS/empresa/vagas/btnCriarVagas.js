document.addEventListener("DOMContentLoaded", () => {
  const btnCriar = document.getElementById("btnCriarVaga");

  if (!btnCriar) {
    console.error("Botão 'Criar Vaga' não encontrado no HTML");
    return;
  }

  btnCriar.addEventListener("click", () => {
    Swal.fire({
      title: "Criar Nova Vaga",
      html: `
    <div style="text-align:left; margin-top:10px;">
        
        <div style="margin-bottom:12px;">
            <label><b>Título da vaga:</b></label>
            <input id="vagaTitulo" class="swal2-input" placeholder="Ex: Auxiliar Administrativo"
                   style="margin-top:6px; width: 400px;">
        </div>

        <div style="margin-bottom:12px;">
            <label><b>Descrição:</b></label>
            <textarea id="vagaDescricao" class="swal2-textarea"
                      placeholder="Descreva a vaga..."
                      style="height: 90px; margin-top:6px; width:400px;"></textarea>
        </div>

        <div style="margin-bottom:12px;">
            <label><b>Salário (opcional):</b></label>
            <input id="vagaSalario" type="number" class="swal2-input" placeholder="Ex: 2500"
                   style="margin-top:6px; width:400px;">
        </div>

        <div style="margin-bottom:12px;">
            <label><b>Local:</b></label>
            <input id="vagaLocal" class="swal2-input" placeholder="Ex: São Paulo - SP"
                   style="margin-top:6px; width:400px;">
        </div>

    </div>
`,

      confirmButtonText: "Criar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const titulo = document.getElementById("vagaTitulo").value.trim();
        const descricao = document.getElementById("vagaDescricao").value.trim();
        const salario = document.getElementById("vagaSalario").value.trim();
        const local = document.getElementById("vagaLocal").value.trim();

        if (!titulo) {
          Swal.showValidationMessage("O título da vaga é obrigatório!");
          return false;
        }

        return { titulo, descricao, salario, local };
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const empresa_id = localStorage.getItem("empresa_id");
      if (!empresa_id) {
        Swal.fire(
          "Erro",
          "Empresa não encontrada. Faça login novamente.",
          "error"
        );
        return;
      }

      const dados = {
        empresa_id,
        titulo: result.value.titulo,
        descricao: result.value.descricao,
        salario: result.value.salario || null,
        local: result.value.local,
      };

      try {
        const resposta = await fetch(
          "http://localhost:3000/acolha/v1/criar_vaga",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
          }
        );

        const retorno = await resposta.json();

        if (!resposta.ok) throw new Error(retorno.erro);

        Swal.fire("Sucesso!", "Vaga criada com sucesso!", "success");
      } catch (err) {
        Swal.fire("Erro", "Não foi possível criar a vaga.", "error");
        console.error(err);
      }
    });
  });
});
