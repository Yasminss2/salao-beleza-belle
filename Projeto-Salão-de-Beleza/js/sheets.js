// ══════════════════════════════════════════════════════════════════════
//  sheets.js — Integração com Google Sheets via Google Apps Script
// ══════════════════════════════════════════════════════════════════════
//
//  COMO CONFIGURAR (passo a passo):
//  1. Acesse https://sheets.google.com e crie uma planilha nova.
//  2. Vá em  Extensões → Apps Script.
//  3. Apague o conteúdo padrão e cole o código do arquivo apps-script.gs.
//  4. Salve (Ctrl+S) e clique em  Implantar → Nova implantação.
//  5. Tipo: "App da Web" | Executar como: "Eu mesmo" | Acesso: "Qualquer pessoa".
//  6. Autorize e copie a URL gerada (começa com https://script.google.com/...).
//  7. Cole a URL na constante SHEETS_URL abaixo e salve.
//
// ══════════════════════════════════════════════════════════════════════

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbw_HNV9XqElrvk7F3-wv6e-QZwuMScyd31xEGKB9fZA0pzTiJaZe3R41n7hos88UtKC/exec"; // ← COLE AQUI a URL do seu Web App do Google Apps Script

/**
 * Envia um pedido para o Google Sheets.
 * Retorna um objeto { ok: true } em caso de sucesso ou { ok: false, motivo: "..." }.
 *
 * Usamos Content-Type: text/plain para evitar o preflight CORS que o Apps Script
 * não responde corretamente — é a abordagem padrão para este tipo de integração.
 */
async function enviarPedidoParaSheets(pedido) {
  if (!SHEETS_URL) {
    console.warn("[Sheets] SHEETS_URL não configurada — pedido salvo apenas no localStorage.");
    return { ok: false, motivo: "sem-url" };
  }

  try {
    const resposta = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(pedido),
      // mode "no-cors" envia a requisição mas não permite ler a resposta —
      // usamos o modo padrão (cors) e o Apps Script adiciona os headers corretos
      // quando implantado com acesso "Qualquer pessoa".
    });

    if (!resposta.ok) {
      throw new Error("HTTP " + resposta.status);
    }

    const json = await resposta.json();
    return json; // { ok: true } ou { ok: false, erro: "..." }

  } catch (erro) {
    console.error("[Sheets] Falha ao enviar pedido:", erro);
    return { ok: false, motivo: String(erro) };
  }
}
