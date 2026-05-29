// ══════════════════════════════════════════════════════════════════════
//  apps-script.gs — cole este código no Google Apps Script da planilha
//
//  PASSOS:
//  1. Abra sua planilha em https://sheets.google.com
//  2. Vá em Extensões → Apps Script
//  3. Apague tudo e cole este código
//  4. Salve (Ctrl+S)
//  5. Clique em Implantar → Nova implantação
//     • Tipo: App da Web
//     • Executar como: Eu mesmo
//     • Quem tem acesso: Qualquer pessoa
//  6. Copie a URL gerada e cole em js/sheets.js na variável SHEETS_URL
// ══════════════════════════════════════════════════════════════════════

// Recebe o POST do site e grava uma linha na aba "Pedidos"
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName("Pedidos");

    // Cria a aba e o cabeçalho se ainda não existirem
    if (!aba) {
      aba = ss.insertSheet("Pedidos");
      aba.appendRow([
        "Data/Hora", "Senha", "Nome", "Tipo", "Itens",
        "Subtotal (R$)", "Desconto (R$)", "Total (R$)", "Pagamento"
      ]);

      // Formata o cabeçalho
      var cabecalho = aba.getRange(1, 1, 1, 9);
      cabecalho.setFontWeight("bold");
      cabecalho.setBackground("#3f1d5e");
      cabecalho.setFontColor("#ffffff");
    }

    // Converte a string ISO para objeto Date (o Sheets exibe no fuso local)
    var dataPedido = dados.data ? new Date(dados.data) : new Date();

    aba.appendRow([
      dataPedido,
      dados.senha    || "",
      dados.nome     || "",
      dados.tipo     || "",
      dados.itens    || "",
      parseFloat(dados.subtotal)  || 0,
      parseFloat(dados.desconto)  || 0,
      parseFloat(dados.total)     || 0,
      dados.pagamento || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Responde a requisições GET (teste rápido no browser)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", msg: "Açaí Tropical — Web App ativo!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
