
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnLogout");

    if (btn) {
        btn.addEventListener("click", () => {
            Swal.fire({
                title: "Deseja sair?",
                text: "Você precisará fazer login novamente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, sair",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear(); // remove sessões
                    window.location.href = "login.html"; // ou o seu login
                }
            });
        });
    }
});

