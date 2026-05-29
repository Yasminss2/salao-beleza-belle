// App do Açaí Tropical — fluxo: cardápio → cliente → carrinho → pagamento → senha
(function () {
  "use strict";

  // ── Utilidades ─────────────────────────────────────────────────────────────
  function escapar(txt) {
    const div = document.createElement("div");
    div.textContent = String(txt == null ? "" : txt);
    return div.innerHTML;
  }
  function precoParaNumero(str) {
    return parseFloat(String(str).replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  }
  function formatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
  }

  // Ano no rodapé
  document.getElementById("ano").textContent = new Date().getFullYear();

  // ── Estado ──────────────────────────────────────────────────────────────────
  let carrinho = {};
  let cliente  = { nome: "", tipo: "" };
  let formaPagamento = "";

  // ── Navegação ───────────────────────────────────────────────────────────────
  function irPara(idEtapa) {
    document.querySelectorAll(".etapa").forEach(function (e) {
      e.classList.remove("ativa");
    });

    // Garante que só a etapa solicitada fique visível
    var alvo = document.getElementById(idEtapa);
    if (alvo) alvo.classList.add("ativa");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Força o estado inicial: somente Home (oculta cliente por padrão)
  // (evita que alguma marcação/estilo inicial deixe a etapa cliente visível)
  document.querySelectorAll(".etapa").forEach(function (e) {
    e.classList.remove("ativa");
  });
  var etapaInicial = document.getElementById("etapa-home");
  if (etapaInicial) etapaInicial.classList.add("ativa");


  // ── ETAPA 1: Cardápio ───────────────────────────────────────────────────────
  const listaCardapio = document.getElementById("lista-itens");
  listaCardapio.innerHTML = ITENS.map(function (item, i) {
    const imgHtml = item.imagem
      ? '<img class="card-img" src="' + escapar(item.imagem) + '" alt="' + escapar(item.nome) + '">'
      : '<div class="card-img placeholder">🍇</div>';
    return (
      '<li class="card" data-idx="' + i + '">' +
        imgHtml +
        '<h3>' + escapar(item.nome) + '</h3>' +
        '<p>' + escapar(item.descricao) + '</p>' +
        '<p class="preco">' + escapar(item.preco) + '</p>' +
        '<div class="card-acoes">' +
          '<button class="btn-carrinho btn-remover" data-idx="' + i + '" disabled aria-label="Remover">−</button>' +
          '<span class="card-qtd" id="qtd-' + i + '" aria-live="polite">0</span>' +
          '<button class="btn-carrinho btn-adicionar" data-idx="' + i + '" aria-label="Adicionar">+</button>' +
        '</div>' +
      '</li>'
    );
  }).join("");

  listaCardapio.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;
    const idx = parseInt(card.dataset.idx, 10);
    if (e.target.classList.contains("btn-remover")) removerItem(idx);
    else adicionarItem(idx);
  });

  function adicionarItem(idx) {
    carrinho[idx] = (carrinho[idx] || 0) + 1;
    atualizarCards();
  }
  function removerItem(idx) {
    if (!carrinho[idx]) return;
    carrinho[idx]--;
    if (carrinho[idx] === 0) delete carrinho[idx];
    atualizarCards();
  }

  function atualizarCards() {
    let totalItens = 0;
    ITENS.forEach(function (_, i) {
      const qtd = carrinho[i] || 0;
      totalItens += qtd;
      const span = document.getElementById("qtd-" + i);
      if (span) span.textContent = qtd;
      const btnR = listaCardapio.querySelector('.btn-remover[data-idx="' + i + '"]');
      if (btnR) btnR.disabled = qtd === 0;
    });
    document.getElementById("carrinho-badge").textContent = totalItens;
    document.getElementById("carrinho-toggle").hidden = totalItens === 0;
  }

  document.getElementById("btn-ir-cliente").addEventListener("click", function () {
    if (Object.keys(carrinho).length === 0) {
      alert("Selecione pelo menos um item do cardápio!");
      return;
    }

    // Abre modal com os dados do cliente (ao invés de mostrar a etapa completa)
    var modal = document.getElementById("modal-dados-cliente");
    if (modal) modal.hidden = false;
  });



  // ── ETAPA 2: Cliente (agora via modal) ──────────────────────────────────────
  var modalDados = document.getElementById("modal-dados-cliente");

  function esconderModalDados() {
    if (modalDados) modalDados.hidden = true;
  }

  function abrirModalDados() {
    if (modalDados) modalDados.hidden = false;
  }

  document.getElementById("modal-dados-fechar").addEventListener("click", function () {
    esconderModalDados();
    irPara("etapa-cardapio");
  });

  document.getElementById("modal-dados-continuar").addEventListener("click", function () {
    const nome = document.getElementById("nome-cliente-modal").value.trim();
    const tipo = document.getElementById("tipo-cliente-modal").value;
    const erro = document.getElementById("erro-cliente-modal");

    if (!nome) {
      erro.textContent = "⚠ Informe seu nome.";
      return;
    }
    if (!tipo) {
      erro.textContent = "⚠ Selecione o tipo de cliente.";
      return;
    }

    erro.textContent = "";
    cliente.nome = nome;
    cliente.tipo = tipo;

    esconderModalDados();
    renderizarCarrinho();

    // Exibe o carrinho como modal
    abrirModalCarrinho();
  });


  // Versão antiga da etapa cliente dentro da mesma página (mantida para compatibilidade)
  var btnVoltarClienteAntigo = document.getElementById("btn-voltar-cardapio");
  if (btnVoltarClienteAntigo) {
    btnVoltarClienteAntigo.addEventListener("click", function () {
      irPara("etapa-cardapio");
    });
  }

  var btnIrCarrinhoAntigo = document.getElementById("btn-ir-carrinho");
  if (btnIrCarrinhoAntigo) {
    btnIrCarrinhoAntigo.addEventListener("click", function () {
      const nome = document.getElementById("nome-cliente").value.trim();
      const tipo = document.getElementById("tipo-cliente").value;
      const erro = document.getElementById("erro-cliente");
      if (!nome) { erro.textContent = "⚠ Informe seu nome."; return; }
      if (!tipo) { erro.textContent = "⚠ Selecione o tipo de cliente."; return; }
      erro.textContent = "";
      cliente.nome = nome;
      cliente.tipo = tipo;
      renderizarCarrinho();
      irPara("etapa-carrinho");
    });
  }


  // ── ETAPA 3: Carrinho ───────────────────────────────────────────────────────
  function calcularTotais() {
    let subtotal = 0;
    Object.keys(carrinho).forEach(function (idx) {
      subtotal += precoParaNumero(ITENS[idx].preco) * carrinho[idx];
    });
    const desc = (DESCONTOS[cliente.tipo] || 0) * subtotal;
    return { subtotal: subtotal, desconto: desc, total: subtotal - desc };
  }

  function renderizarCarrinho() {
    document.getElementById("ola-cliente").textContent =
      "Olá, " + cliente.nome + " (" + cliente.tipo + ")";

    const ul = document.getElementById("carrinho-lista-full");
    if (Object.keys(carrinho).length === 0) {
      ul.innerHTML = '<li class="carrinho-vazio">Carrinho vazio.</li>';
    } else {
      ul.innerHTML = Object.keys(carrinho).map(function (idx) {
        const item = ITENS[idx];
        const qtd  = carrinho[idx];
        const sub  = precoParaNumero(item.preco) * qtd;
        return (
          '<li class="carrinho-item">' +
            '<span class="carrinho-item-nome">' + escapar(item.nome) + '</span>' +
            '<span class="carrinho-item-ctrl">' +
              '<button class="btn-carrinho btn-remover" data-idx="' + idx + '" aria-label="Remover">−</button>' +
              '<span>' + qtd + '</span>' +
              '<button class="btn-carrinho btn-adicionar" data-idx="' + idx + '" aria-label="Adicionar">+</button>' +
            '</span>' +
            '<span class="carrinho-item-subtotal">' + formatarPreco(sub) + '</span>' +
          '</li>'
        );
      }).join("");
    }

    const t = calcularTotais();
    document.getElementById("subtotal").textContent      = formatarPreco(t.subtotal);
    document.getElementById("desconto").textContent      = "− " + formatarPreco(t.desconto);
    document.getElementById("total-carrinho").textContent = formatarPreco(t.total);
  }

  document.getElementById("carrinho-lista-full").addEventListener("click", function (e) {
    const btn = e.target.closest("[data-idx]");
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if (btn.classList.contains("btn-adicionar")) adicionarItem(idx);
    else if (btn.classList.contains("btn-remover")) removerItem(idx);
    renderizarCarrinho();
  });

  var modalCarrinho = document.getElementById("modal-carrinho");

  function abrirModalCarrinho() {
    if (modalCarrinho) modalCarrinho.hidden = false;
  }

  function fecharModalCarrinho() {
    if (modalCarrinho) modalCarrinho.hidden = true;
  }

  document.getElementById("btn-voltar-cliente").addEventListener("click", function () {
    fecharModalCarrinho();
    irPara("etapa-cardapio");
  });

  document.getElementById("btn-finalizar").addEventListener("click", function () {

    if (Object.keys(carrinho).length === 0) {
      alert("Adicione itens ao carrinho!");
      return;
    }
    const ul = document.getElementById("modal-itens");
    ul.innerHTML = Object.keys(carrinho).map(function (idx) {
      const item = ITENS[idx];
      const qtd  = carrinho[idx];
      const sub  = precoParaNumero(item.preco) * qtd;
      return '<li class="carrinho-item">' +
        '<span class="carrinho-item-nome">' + escapar(item.nome) + ' x' + qtd + '</span>' +
        '<span class="carrinho-item-subtotal">' + formatarPreco(sub) + '</span>' +
      '</li>';
    }).join("");
    document.getElementById("modal-total").textContent = formatarPreco(calcularTotais().total);
    document.getElementById("modal-confirmar").hidden = false;
  });

  document.getElementById("modal-cancelar").addEventListener("click", function () {
    document.getElementById("modal-confirmar").hidden = true;
  });

  document.getElementById("modal-confirmar-btn").addEventListener("click", function () {
    document.getElementById("modal-confirmar").hidden = true;
    document.getElementById("total-pagamento").textContent = formatarPreco(calcularTotais().total);

    // fecha carrinho modal ao ir para pagamento
    fecharModalCarrinho();

    // abre modal de pagamento ao invés de navegar para a seção
    abrirModalPagamento();
  });



  // ── ETAPA 4: Pagamento (agora em modal) ─────────────────────────────────────
  var modalPagamento = document.getElementById("modal-pagamento");

  function abrirModalPagamento() {
    if (modalPagamento) modalPagamento.hidden = false;
  }

  function fecharModalPagamento() {
    if (modalPagamento) modalPagamento.hidden = true;
  }

  document.getElementById("btn-voltar-carrinho").addEventListener("click", function () {
    fecharModalPagamento();
    abrirModalCarrinho();
  });


  document.querySelectorAll(".btn-pgto").forEach(function (btn) {
    btn.addEventListener("click", function () {
      formaPagamento = btn.dataset.forma;

      const senha = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
      document.getElementById("forma-escolhida").textContent  = formaPagamento;
      document.getElementById("senha-numero").textContent     = senha;
      document.getElementById("status-pedido").textContent    = "⏳ Preparando seu pedido...";
      document.getElementById("btn-novo-pedido").hidden       = true;
      document.getElementById("status-sheets").textContent    = "";

      // fecha modal pagamento e abre modal senha
      fecharModalPagamento();
      var modalSenha = document.getElementById("modal-senha");
      if (modalSenha) modalSenha.hidden = false;


      // ── Monta o objeto do pedido ──────────────────────────────────────────
      const totais = calcularTotais();
      const itensTxt = Object.keys(carrinho).map(function (idx) {
        return ITENS[idx].nome + " x" + carrinho[idx];
      }).join("; ");

      const pedido = {
        senha:     senha,
        nome:      cliente.nome,
        tipo:      cliente.tipo,
        itens:     itensTxt,
        subtotal:  totais.subtotal.toFixed(2),
        desconto:  totais.desconto.toFixed(2),
        total:     totais.total.toFixed(2),
        pagamento: formaPagamento,
        data:      new Date().toISOString()
      };

      // ── 1) Salva no localStorage ──────────────────────────────────────────
      salvarLocal(pedido);

      // ── 2) Envia para Google Sheets ───────────────────────────────────────
      if (typeof enviarPedidoParaSheets === "function") {
        const statusEl = document.getElementById("status-sheets");
        statusEl.textContent = "📤 Enviando para a planilha...";

        enviarPedidoParaSheets(pedido).then(function (resultado) {
          if (resultado.ok) {
            statusEl.textContent = "✅ Registrado na planilha com sucesso!";
            statusEl.className   = "form-status";
          } else if (resultado.motivo === "sem-url") {
            statusEl.textContent = "💾 Salvo localmente (planilha não configurada).";
            statusEl.className   = "form-status muted";
          } else {
            statusEl.textContent = "⚠ Salvo localmente. Erro ao enviar: " + resultado.motivo;
            statusEl.className   = "form-status erro";
          }
        });
      }

      // Simula preparação (5 s)
      setTimeout(function () {
        document.getElementById("status-pedido").textContent =
          "🎉 Pedido pronto! Senha " + senha + " — retire no balcão.";
        document.getElementById("btn-novo-pedido").hidden = false;
      }, 5000);
    });
  });

  // ── ETAPA 5: Novo pedido ────────────────────────────────────────────────────
  var modalSenha = document.getElementById("modal-senha");

  document.getElementById("btn-novo-pedido").addEventListener("click", function () {
    if (modalSenha) modalSenha.hidden = true;

    carrinho        = {};

    cliente         = { nome: "", tipo: "" };
    formaPagamento  = "";
    document.getElementById("nome-cliente").value  = "";
    document.getElementById("tipo-cliente").value  = "";
    atualizarCards();
    esconderModalDados();
    fecharModalCarrinho();
    fecharModalPagamento();
    if (modalSenha) modalSenha.hidden = true;
    irPara("etapa-cardapio");
  });


  // ── Histórico local ─────────────────────────────────────────────────────────
  const CHAVE_LS = "acai_pedidos";

  function salvarLocal(pedido) {
    try {
      const lista = JSON.parse(localStorage.getItem(CHAVE_LS) || "[]");
      lista.push(pedido);
      localStorage.setItem(CHAVE_LS, JSON.stringify(lista));
      renderizarHistorico();
    } catch (e) {
      console.error("localStorage:", e);
    }
  }

  function lerPedidosLocais() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_LS) || "[]");
    } catch (e) {
      return [];
    }
  }

  function renderizarHistorico() {
    const container = document.getElementById("historico-lista");
    if (!container) return;
    const pedidos = lerPedidosLocais();

    if (pedidos.length === 0) {
      container.innerHTML = '<p class="muted carrinho-vazio">Nenhum pedido registrado ainda.</p>';
      document.getElementById("btn-exportar-csv").hidden = true;
      return;
    }

    document.getElementById("btn-exportar-csv").hidden = false;

    // Tabela de histórico
    let html = '<table class="tabela-historico">' +
      '<thead><tr>' +
        '<th>Data/Hora</th><th>Senha</th><th>Nome</th><th>Tipo</th>' +
        '<th>Itens</th><th>Subtotal</th><th>Desconto</th><th>Total</th><th>Pagamento</th>' +
      '</tr></thead><tbody>';

    pedidos.slice().reverse().forEach(function (p) {
      const data = new Date(p.data).toLocaleString("pt-BR");
      html += '<tr>' +
        '<td>' + escapar(data) + '</td>' +
        '<td><strong>' + escapar(p.senha) + '</strong></td>' +
        '<td>' + escapar(p.nome) + '</td>' +
        '<td>' + escapar(p.tipo) + '</td>' +
        '<td>' + escapar(p.itens) + '</td>' +
        '<td>R$ ' + escapar(p.subtotal) + '</td>' +
        '<td>R$ ' + escapar(p.desconto) + '</td>' +
        '<td><strong>R$ ' + escapar(p.total) + '</strong></td>' +
        '<td>' + escapar(p.pagamento) + '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // Exportar para CSV
  document.getElementById("btn-exportar-csv").addEventListener("click", function () {
    const pedidos = lerPedidosLocais();
    if (pedidos.length === 0) { alert("Nenhum pedido para exportar."); return; }

    const cabecalho = ["Data/Hora","Senha","Nome","Tipo","Itens","Subtotal","Desconto","Total","Pagamento"];
    const linhas = pedidos.map(function (p) {
      return [
        new Date(p.data).toLocaleString("pt-BR"),
        p.senha, p.nome, p.tipo, p.itens,
        p.subtotal, p.desconto, p.total, p.pagamento
      ].map(function (c) {
        // Envolve em aspas se contiver vírgula
        return String(c).indexOf(",") > -1 ? '"' + c + '"' : c;
      }).join(",");
    });

    const csv     = [cabecalho.join(",")].concat(linhas).join("\n");
    const blob    = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url     = URL.createObjectURL(blob);
    const link    = document.createElement("a");
    link.href     = url;
    link.download = "pedidos_acai.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  // Limpar histórico
  document.getElementById("btn-limpar-historico").addEventListener("click", function () {
    if (!confirm("Tem certeza que deseja apagar todo o histórico local?")) return;
    localStorage.removeItem(CHAVE_LS);
    renderizarHistorico();
  });

  // Renderiza ao carregar
  renderizarHistorico();

})();
