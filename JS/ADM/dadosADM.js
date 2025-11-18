import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js";

const token = localStorage.getItem("dados");

if (token) {
  let usuario = jwtDecode(token);
console.log(usuario);

  let nomeAdm = document.querySelector(".span-nome");
  nomeAdm.textContent = usuario.nome;
  
  let emailAdm = document.querySelector(".email");
  emailAdm.textContent = usuario.email;
  
} else {
  console.log("Nenhum token encontrado");
}
