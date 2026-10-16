// Ajusta com base no custo real de envio da Printful e na tua margem (vê o /admin).
export const FREE_SHIPPING_THRESHOLD = 60; // EUR
export const SHIPPING_FEE = 4.9;           // EUR
// GB fora por defeito (alfândega/IVA pós-Brexit). Só acrescenta depois de confirmares como a Printful trata isso.
export const COUNTRIES = ["PT", "ES", "FR", "DE", "IT", "NL", "BE", "IE"] as const;
