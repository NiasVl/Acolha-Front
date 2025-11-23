async function carregarVagas() {
  try {
    const resposta = await fetch("http://localhost:3000/acolha/v1/buscar_vagas");
    const vagas = await resposta.json();

    const container = document.getElementById("cards-container");
    container.innerHTML = "";

    vagas.forEach((vaga) => {
      const card = document.createElement("div");
      card.classList.add("profile-card");

      card.innerHTML = `
        <img src="../IMG/LogoAcolhaBranco.png" class="profile-img"/>
        <h3 class="card-title">${vaga.titulo}</h3>
        <p class="card-text">Local: ${vaga.local}</p>
        <p class="card-text"><b>Salário:</b> ${vaga.salario}</p>
        <button class="btn btn-warning btn-candidatar" 
                data-vaga="${vaga.id}" 
                style="color: white">
            Candidatar-se
        </button>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar vagas:", error);
  }
}

carregarVagas();

 
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-candidatar")) {

    const usuarioID = localStorage.getItem("usuario_id");
    const vagaID = e.target.getAttribute("data-vaga");

    if (!usuarioID) {
      Swal.fire("Erro", "Você não está logado!", "error");
      return;
    }

    Swal.fire({
      title: "Enviar Currículo",
      html: `
        <p>Selecione seu currículo (PDF):</p>
        <input type="file" id="curriculoInput" class="swal2-file" accept="application/pdf">
      `,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const file = document.getElementById("curriculoInput").files[0];
        if (!file) {
          Swal.showValidationMessage("Envie um arquivo PDF!");
          return false;
        }
        return file;
      }
    }).then(async (resultado) => {
      if (!resultado.isConfirmed) return;

      const arquivo = resultado.value;

      const formData = new FormData();
      formData.append("usuarios_id", usuarioID);
      formData.append("vaga_id", vagaID);
      formData.append("curriculo", arquivo);

      try {
        const resposta = await fetch("http://localhost:3000/acolha/v1/candidatar", {
          method: "POST",
          body: formData
        });

        const data = await resposta.json();

        if (resposta.ok) {
          Swal.fire("Sucesso!", "Candidatura enviada!", "success");
        } else {
          Swal.fire("Erro", data.erro, "error");
        }

      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Falha ao enviar candidatura.", "error");
      }
    });
  }
});
