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
      { h: "Encomendas e preços", p: "Os preços estão em euros, com IVA incluído. Os portes são calculados no pagamento. O contrato fica concluído quando recebes o e-mail de confirmação da encomenda." },
      { h: "Pagamento", p: "O pagamento é processado pela Stripe. Nós não guardamos os dados do teu cartão." },
      { h: "Produção por encomenda", p: "Cada peça é produzida depois da tua encomenda. As cores podem ter ligeiras variações em relação ao ecrã." },
      { h: "Retirada do contrato", p: "Tens 14 dias para te retirares do contrato sem justificação. Vê a página Envios e devoluções." },
      { h: "Garantia legal", p: "Os bens novos têm garantia legal de 3 anos, nos termos da lei portuguesa. Em caso de defeito podes pedir reparação, substituição, redução do preço ou resolução do contrato." },
      { h: "Reclamações", p: "Tens à tua disposição o Livro de Reclamações Eletrónico (livroreclamacoes.pt). Podes também recorrer a uma entidade de resolução alternativa de litígios de consumo (consumidor.gov.pt)." },
      { h: "Lei aplicável", p: "Aplica-se a lei portuguesa, sem prejuízo dos direitos imperativos do teu país de residência." },
    ],
  },
  "envios-e-devolucoes": {
    title: "Envios e devoluções",
    sections: [
      { h: "Prazos", p: "A produção demora cerca de 2 a 5 dias úteis e o envio mais 3 a 7 dias úteis, conforme o destino. São estimativas, não garantias. [Confirma com a Printful.]" },
      { h: "Retirar-me do contrato", p: `Podes retirar-te do contrato em 14 dias a contar da receção da peça, sem justificação. Usa a página Retirar do contrato ou escreve para ${E.email}.` },
      { h: "Como devolver", p: `Depois de nos informares, tens 14 dias para enviar a peça para ${E.returns}. Os custos de devolução são por tua conta. A peça deve estar sem uso para além do necessário para a experimentar.` },
      { h: "Reembolso", p: "Reembolsamos o valor da peça e dos portes de envio standard, pelo mesmo meio de pagamento, no máximo 14 dias depois de recebermos a tua declaração. Podemos aguardar pela receção da peça." },
      { h: "Defeitos ou erros", p: "Se a peça chegar com defeito ou diferente do que encomendaste, envia-nos uma fotografia em 14 dias. Substituímos ou reembolsamos sem custos para ti." },
    ],
  },
  privacidade: {
    title: "Política de privacidade",
    sections: [
      { h: "Responsável", p: `${E.name}, NIF ${E.nif}, ${E.address}. Contacto: ${E.email}.` },
      { h: "Dados que tratamos", p: "Nome, e-mail, telefone e morada de entrega, o conteúdo da encomenda e dados técnicos de navegação. O pagamento é feito na Stripe e nós não vemos nem guardamos o cartão." },
      { h: "Para que usamos", p: "Executar a encomenda (contrato), cumprir obrigações fiscais e legais, responder a pedidos de suporte e, só com o teu consentimento, enviar marketing e medir anúncios." },
      { h: "Quem recebe os dados", p: "Stripe (pagamentos), Printful (produção e envio), Zoho (CRM e e-mail), [alojamento] e, só com consentimento, Meta e TikTok (medição de anúncios). Alguns estão fora da UE e usam mecanismos legais de transferência, como as cláusulas contratuais-tipo." },
      { h: "Cookies", p: "Os cookies de marketing só são ativados se aceitares no banner. Podes recusar sem perder nenhuma funcionalidade da loja." },
      { h: "Conservação", p: "Guardamos os dados da encomenda pelo tempo exigido pela lei fiscal e contabilística. Os dados de marketing, até retirares o consentimento." },
      { h: "Os teus direitos", p: `Podes pedir acesso, retificação, apagamento, limitação, portabilidade e oposição em ${E.email}. Podes retirar o consentimento a qualquer momento e apresentar queixa à CNPD (cnpd.pt).` },
    ],
  },
};
