document
  .getElementById("form-login")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const erroDiv = document.getElementById("erro");

    try {
      // Envia as credenciais para a nossa rota de Login do Node
      const resposta = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, senha },
      );

      // 💾 SALVAMENTO NO LOCALSTORAGE (Sessão do Usuário)
      // Guardamos o Token JWT e as informações de nível de acesso no navegador
      localStorage.setItem("token", resposta.data.token);
      localStorage.setItem("usuario_nome", resposta.data.nome);
      localStorage.setItem("usuario_nivel", resposta.data.nivel);

      // Direciona o usuário para o painel principal logado
      window.location.href = "index.html";
    } catch (erro) {
      // Buscamos pela propriedade '.error' que é devolvida pelo seu authController.js no Node
      if (erro.response && erro.response.data && erro.response.data.error) {
        erroDiv.innerText = erro.response.data.error; // Vai exibir "E-mail ou senha inválidos!"
      } else {
        erroDiv.innerText = erro.response?.data?.erro || "Erro de conexão.";
      }
      erroDiv.style.display = "block";
    }
  });
