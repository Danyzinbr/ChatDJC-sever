const sendBtn = document.getElementById("send");
const imgBtn = document.getElementById("gerarImg");
const input = document.getElementById("txt");
const msgs = document.getElementById("msgs");

sendBtn.addEventListener("click", enviarMensagem);
imgBtn.addEventListener("click", gerarImagem);

// 🟩 Enviar texto
async function enviarMensagem() {
  const texto = input.value.trim();
  if (texto === "") return;

  adicionarMensagem("Você", texto);
  input.value = "";

  try {
    const res = await fetch("http://localhost:3000/ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: texto })
    });

    const dados = await res.json();

    if (dados.erro) {
      adicionarMensagem("ChatDJC", "Erro: " + dados.erro);
    } else {
      adicionarMensagem("ChatDJC", dados.resposta);
    }

  } catch (erro) {
    adicionarMensagem("ChatDJC", "Erro ao conectar ao servidor.");
  }
}

// 🟦 Gerar imagem
async function gerarImagem() {
  const descricao = window.prompt("Descreva a imagem que deseja gerar:");

  if (!descricao) return;

  adicionarMensagem("Você", "Gerando imagem: " + descricao);

  try {
    const res = await fetch("https://chatdjc-sever.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: descricao })
    });

    const dados = await res.json();

    if (dados.imagem) {
      const imgTag = `<img src="data:image/png;base64,${dados.imagem}" class="img-gerada">`;
      adicionarMensagem("ChatDJC", imgTag);
    } else {
      adicionarMensagem("ChatDJC", "Erro ao gerar imagem.");
    }

  } catch (erro) {
    adicionarMensagem("ChatDJC", "Erro ao conectar ao servidor.");
  }
}

// 📝 Função para adicionar mensagens
function adicionarMensagem(remetente, texto) {
  const div = document.createElement("div");
  div.className = "msg";

  div.innerHTML = `<b>${remetente}:</b> ${texto}`;
  
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
