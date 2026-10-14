// Escuta o envio do formulário de cadastro
document
  .getElementById("form-cadastro-usuario")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const nivel_acesso_id = parseInt(
      document.getElementById("nivel_acesso").value,
    );

    try {
      const resposta = await api.post("/auth/registrar", {
        nome,
        email,
        senha,
        nivel_acesso_id, // Enviado como número (1 ou 2) atendendo à sua regra de FK
      });

      alert(resposta.data.mensagem);
      document.getElementById("form-cadastro-usuario").reset(); // Limpa a tela
    } catch (erro) {
      console.error(erro);
      alert(erro.response?.data?.erro || "Erro ao conectar com o servidor.");
    }
  });
