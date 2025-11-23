import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js";

let token = localStorage.getItem('dados');

if (token) {
  let usuario = jwtDecode(token);
console.log(usuario);

  let nome = document.querySelector(".span-nome");
  nome.textContent = usuario.nome;
  
  let email = document.querySelector(".email");
  email.textContent = usuario.email;


  localStorage.setItem('usuario_id', usuario.id);
  
} else {
  console.log("Nenhum token encontrado");
}
