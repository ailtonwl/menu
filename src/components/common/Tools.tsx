export function formatarParaBRL(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor).replace('R$', '').trim();
};

export function aplicarMascaraMonetaria(valor: string): string {
  const somenteNumeros = valor.replace(/\D/g, '');
  const numero = parseFloat(somenteNumeros) / 100;

  if (isNaN(numero)) return '';

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}
