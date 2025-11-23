document.getElementById("btn").addEventListener("click", async () => {
    const protocolo = document.getElementById("basic-url").value.trim();
    const textarea = document.getElementById("floatingTextarea2");

    if (!protocolo) {
        Swal.fire("Atenção", "Digite um número de protocolo.", "warning");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/acolha/v1/solicitacao/protocolo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ protocolo })
        });

        const dados = await res.json();

        if (res.status === 404) {
            textarea.value = "❌ Solicitação não encontrada.";
            expandirTextarea();
            return;
        }

        const s = dados[0];

        const data = new Date(s.data_criacao).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo"
        });

        textarea.value =
            `📌 Assunto: ${s.assunto}\n\n` +
            `📝 Descrição:\n${s.descricao}\n\n` +
            `📄 Protocolo: ${s.protocolo}\n` +
            `📅 Criado em: ${data}\n` +
            `📌 Status: ${s.status}\n\n` +
            (s.resposta
                ? "✅ Resposta do ADM:\n" + s.resposta
                : "⏳ Ainda aguardando uma resposta.");

        expandirTextarea();

    } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível consultar a solicitação.", "error");
    }
});


function expandirTextarea() {
    const textarea = document.getElementById("floatingTextarea2");

    textarea.style.height = "auto";  
    textarea.style.height = (textarea.scrollHeight + 10) + "px"; 
}
