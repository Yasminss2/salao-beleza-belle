# 🍇 Açaí Tropical — Sistema de Pedidos

Projeto didático em HTML semântico, CSS básico e JavaScript puro (sem frameworks).

---

## 🔄 Fluxo do pedido
1. **Cardápio** → cliente adiciona itens clicando nos cards.
2. **Dados do cliente** → Nome + tipo (N / P / V com desconto).
3. **Carrinho** → revisão com totais e desconto aplicado.
4. **Confirmação** → modal com total final.
5. **Pagamento** → escolha da forma (Dinheiro, PIX, Débito, Crédito).
6. **Senha** → número gerado + status de envio para a planilha.

---

## 📁 Estrutura de arquivos
```
acai/
├── index.html          ← página principal
├── apps-script.gs      ← código para colar no Google Apps Script
├── css/
│   └── style.css
└── js/
    ├── dados.js        ← itens do cardápio + tabela de descontos
    ├── sheets.js       ← integração Google Sheets (configurar SHEETS_URL)
    └── app.js          ← lógica completa da aplicação
```

---

## 📊 Como conectar ao Google Sheets

### Passo a passo

1. Acesse [https://sheets.google.com](https://sheets.google.com) e crie uma planilha nova.
2. Vá em **Extensões → Apps Script**.
3. Apague o conteúdo padrão e cole o código do arquivo `apps-script.gs`.
4. Salve (Ctrl+S).
5. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu mesmo**
   - Quem tem acesso: **Qualquer pessoa**
6. Clique em **Implantar** e autorize as permissões solicitadas.
7. Copie a URL gerada (ex.: `https://script.google.com/macros/s/AKfy.../exec`).
8. Abra `js/sheets.js` e cole a URL na constante:
   ```js
   const SHEETS_URL = "https://script.google.com/macros/s/SEU_ID/exec";
   ```

### O que é registrado na planilha

| Coluna        | Descrição                          |
|---------------|------------------------------------|
| Data/Hora     | Timestamp do pedido                |
| Senha         | Número da senha (ex.: 042)         |
| Nome          | Nome do cliente                    |
| Tipo          | N / P / V                          |
| Itens         | Lista resumida (nome x quantidade) |
| Subtotal      | Valor sem desconto                 |
| Desconto      | Valor do desconto                  |
| Total         | Valor final pago                   |
| Pagamento     | Forma de pagamento escolhida       |

---

## 💾 Histórico local (localStorage)

Independente do Google Sheets, **todos os pedidos ficam salvos no navegador**.
Na seção **Histórico de pedidos** (parte inferior da página) você pode:
- Ver todos os pedidos em tabela.
- **Exportar como CSV** para abrir no Excel ou Google Sheets.
- **Limpar** o histórico local.

---

## 💡 Atividades sugeridas
- Adicionar campo de telefone no cadastro.
- Mostrar gráfico de vendas por forma de pagamento.
- Criar painel de cozinha lendo a planilha via API.
- Substituir os `alert()` por mensagens de toast animadas.
- Adicionar busca/filtro no histórico de pedidos.
