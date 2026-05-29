// Dados do cardápio. Edite para alterar os itens.
const ITENS = [
  { nome: "Cortes Femininos",      descricao: "Cortes de cabelo no estilo escolhido do cliente",        preco: "R$99,99", imagem: "img/cortes.png" },
  { nome: "Coloração",      descricao: "Coloração profissional para realçar seu cabelo, Tinta, Luzes, Mechas.",        preco: "R$ 189,99", imagem: "img/mechas.png" },
  { nome: "Penteados",      descricao: "Estilos e penteados profissionais e Personalizados para qulaquer ocasião", preco: "R$ 149,99", imagem: "img/penteado.png" },
  { nome: "Escovação", descricao: "Escova de alta qualidade para dar volume e brilho ao seu cabelo",      preco: "R$ 89,99", imagem: "img/escovacao.png" },
  { nome: "Progressiva", descricao: "Tratamento capilar que alinha o cabelo, reduz o frizz e proporcioana brilho e saúde", preco: "R$ 110,00", imagem: "img/progressiva.png" },
  { nome: "Manicure", descricao: "Corte, Lixamento, cuidado com cúticulas e esmaltação impecável",      preco: "R$ 89,99", imagem: "img/manicure.png" },
  { nome: "Pedicure", descricao: "Cuidado completo para seus pés com hidratação, remoção e rachaduras, massagem relaxante e esmaltação",      preco: "R$ 79,99", imagem: "img/pe.png" },
  { nome: "Maquiagem", descricao: "Realce sua maquiagem sofisticada com prepração de pele e produção completa, fique preprada em qualquer ocasião especial",      preco: "R$ 120,00", imagem: "img/maquiagem.png"}
];


// Descontos por tipo de cliente
const DESCONTOS = {
  "N": 0,     // Comum
  "P": 0.20,  // Preferencial
  "V": 0.15   // VIP
};
