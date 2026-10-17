// MODELO. Preenche os [campos] e pede revisão a um advogado antes de publicar.
export const E = {
  name: "[NOME DA EMPRESA]", nif: "[NIF]", address: "[MORADA]",
  email: "[EMAIL DE SUPORTE]", returns: "[MORADA DE DEVOLUÇÕES]",
};
type Doc = { title: string; sections: { h: string; p: string }[] };

export const legal: Record<string, Doc> = {
  termos: {
    title: "Termos e condições",
    sections: [
      { h: "Quem vende", p: `${E.name}, NIF ${E.nif}, ${E.address}. Contacto: ${E.email}.` },
      { h: "Encomendas e preços", p: "Os preços são apresentados em reais (BRL). O frete é cobrado do cliente e informado no checkout. Tributos e informações fiscais devem ser confirmados pelo vendedor antes da publicação. O contrato fica concluído quando recebes o e-mail de confirmação da encomenda." },
      { h: "Pagamento", p: "O pagamento é processado pela Stripe. Nós não guardamos os dados do teu cartão." },
      { h: "Produção por encomenda", p: "Cada peça é produzida depois da tua encomenda. As cores podem ter ligeiras variações em relação ao ecrã." },
      { h: "Retirada do contrato", p: "As condições de cancelamento, arrependimento, troca e devolução devem ser alinhadas ao Código de Defesa do Consumidor brasileiro e ao modelo de produção sob encomenda antes da publicação." },
      { h: "Garantia legal", p: "Aplicam-se os direitos de garantia previstos na legislação brasileira de defesa do consumidor. As condições finais devem ser revisadas conforme o produto e a operação." },
      { h: "Reclamações", p: "Em caso de conflito de consumo, podes recorrer aos canais oficiais brasileiros de defesa do consumidor, como o Procon e a plataforma consumidor.gov.br." },
      { h: "Lei aplicável", p: "Aplica-se a legislação brasileira pertinente, sem prejuízo de direitos obrigatórios do consumidor." },
    ],
  },
  "envios-e-devolucoes": {
    title: "Envios e devoluções",
    sections: [
      { h: "Prazos", p: "A produção demora cerca de 2 a 5 dias úteis e o envio mais 3 a 7 dias úteis, conforme o destino. São estimativas, não garantias. [Confirma com a Printful.]" },
      { h: "Retirar-me do contrato", p: `Para solicitar cancelamento, troca ou devolução, contacta ${E.email}. As condições e os prazos devem ser confirmados e publicados em conformidade com a legislação brasileira aplicável.` },
      { h: "Como devolver", p: `O endereço e o procedimento de devolução serão informados pelo suporte após validação do pedido, respeitando a legislação brasileira aplicável.` },
      { h: "Reembolso", p: "Reembolsos serão processados pelo meio de pagamento original, conforme as regras aplicáveis e após validação do pedido." },
      { h: "Defeitos ou erros", p: "Se a peça chegar com defeito ou diferente do pedido, contacta o suporte com fotos e os dados da compra para análise e solução conforme a legislação brasileira." },
    ],
  },
  privacidade: {
    title: "Política de privacidade",
    sections: [
      { h: "Responsável", p: `${E.name}, NIF ${E.nif}, ${E.address}. Contacto: ${E.email}.` },
      { h: "Dados que tratamos", p: "Nome, e-mail, telefone e morada de entrega, o conteúdo da encomenda e dados técnicos de navegação. O pagamento é feito na Stripe e nós não vemos nem guardamos o cartão." },
      { h: "Para que usamos", p: "Executar a encomenda (contrato), cumprir obrigações fiscais e legais, responder a pedidos de suporte e, só com o teu consentimento, enviar marketing e medir anúncios." },
      { h: "Quem recebe os dados", p: "Stripe (pagamentos), Printful (produção e envio), Zoho (CRM e e-mail), [alojamento] e, só com consentimento, Meta e TikTok (medição de anúncios). O tratamento e o compartilhamento de dados devem observar a LGPD e os contratos aplicáveis com os prestadores." },
      { h: "Cookies", p: "Os cookies de marketing só são ativados se aceitares no banner. Podes recusar sem perder nenhuma funcionalidade da loja." },
      { h: "Conservação", p: "Guardamos os dados da encomenda pelo tempo exigido pela lei fiscal e contabilística. Os dados de marketing, até retirares o consentimento." },
      { h: "Os teus direitos", p: `Podes pedir acesso, retificação, apagamento, limitação, portabilidade e oposição em ${E.email}. Podes retirar o consentimento a qualquer momento e apresentar queixa à CNPD (gov.br/anpd).` },
    ],
  },
};
