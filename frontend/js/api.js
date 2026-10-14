// 🛡️ VERIFICAÇÃO DE SESSÃO LOCAL ATIVA
// Se o usuário não tiver token e tentar acessar páginas internas, é expulso na hora
const paginaAtual = window.location.pathname;
if (!localStorage.getItem("token") && !paginaAtual.includes("login.html")) {
  window.location.href = "login.html";
}

// Configuração da instância centralizada do Axios
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// INTERCEPTOR DE REQUISIÇÃO: Injeta o Token JWT em 100% dos fetches automáticos
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  },
);

// INTERCEPTOR DE RESPOSTA: Expulsa o usuário se o token expirar ou for inválido (401/403)
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401 || erro.response?.status === 403) {
      alert("Sua sessão expirou ou você não tem permissão para esta ação!");
      localStorage.clear();
      window.location.href = "login.html";
    }
    return Promise.reject(erro);
  },
);

// 👤 EXIBIÇÃO DE PERFIL AND CONTROLE VISUAL DE PERMISSÕES
function aplicarPermissoesDeTela() {
  const nomeUsuario = localStorage.getItem("usuario_nome");
  const nivelUsuario = localStorage.getItem("usuario_nivel");

  const txtBoasVindas = document.getElementById("mensagem-boas-vindas");
  if (txtBoasVindas && nomeUsuario) {
    txtBoasVindas.innerHTML = `Olá, <strong>${nomeUsuario}</strong>! Bem-vindo ao sistema.`;
  }

  const txtBadge = document.getElementById("badge-nivel");
  if (txtBadge && nivelUsuario) {
    txtBadge.innerText = nivelUsuario;
    txtBadge.style.backgroundColor =
      nivelUsuario === "admin" ? "#f2ce5a" : "#cecfd1";
    txtBadge.style.color = nivelUsuario === "admin" ? "#856404" : "#383d41";
  }

  // Se for operador, esconde os botões e formulários administrativos pelo CSS e DOM
  if (nivelUsuario === "operador") {
    const elementosAdmin = [
      document.getElementById("form-produto"),
      document.getElementById("titulo-form"),
      document.getElementById("menu-usuarios"),
    ];
    elementosAdmin.forEach((el) => {
      if (el) el.style.display = "none";
    });

    const style = document.createElement("style");
    style.innerHTML = ".btn-editar, .btn-excluir {display: none !important;}";
    document.head.appendChild(style);
  }
}

// Configura o funcionamento global do botão de Logout e inicializa as permissões
document.addEventListener("DOMContentLoaded", () => {
  aplicarPermissoesDeTela();

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("Deseja realmente sair do sistema?")) {
        localStorage.clear();
        window.location.href = "login.html";
      }
    });
  }
});
