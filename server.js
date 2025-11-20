const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 📌 IA TEXTO
app.post("/ia", async (req, res) => {
  const pergunta = req.body.pergunta;

  try {
    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: pergunta }]
    });

    res.json({
      resposta: resposta.choices[0].message.content
    });
  } catch (err) {
    res.json({ erro: err.message });
  }
});

// 📌 IA IMAGEM
app.post("/imagem", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const gerada = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    });

    const base64 = gerada.data[0].b64_json;

    res.json({ imagem: base64 });

  } catch (err) {
    res.json({ erro: err.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});


