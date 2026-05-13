export function formatPrice(price: number): string {
  // Forzamos el formato chileno (puntos como separadores de miles)
  // de forma consistente en servidor y cliente para evitar errores de hidratación.
  return new Intl.NumberFormat('es-CL').format(price);
}
