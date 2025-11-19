import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js";

const token = localStorage.getItem("dados");

if (token) {
  let empresa = jwtDecode(token);
console.log(empresa);

  let nome = document.querySelector(".span-nome");
  nome.textContent = empresa.nome;
  
  let email = document.querySelector(".email");
  email.textContent = empresa.email;
  
  localStorage.setItem("empresa_id", empresa.id);
  console.log("ID da empresa armazenado:", empresa.id);
} else {
  console.log("Nenhum token encontrado");
}
