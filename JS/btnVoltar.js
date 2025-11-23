
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnLogout");

    if (btn) {
        btn.addEventListener("click", () => {
            Swal.fire({
                title: "Deseja voltar?",
                text: "Você precisará preencher os dados novamente depois.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, voltar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear(); 
                    window.location.href = "login.html";  
                }
            });
        });
    }
});

