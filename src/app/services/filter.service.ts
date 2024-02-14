// Clase de filtro genérica
export class Filtro<T> {
  orderBy: boolean = true;

  filtrarPorPropiedad(items: T[], propiedad: keyof T): T[] {
    // Si items está vacío o tiene solo un elemento, no es necesario ordenar
    if (items.length <= 1) return items;

    // Invertir el estado de orden al llamar a la función
    this.orderBy = !this.orderBy;

    // Ordenar los items según el estado actual (ascendente o descendente)
    if (this.orderBy) {
      // Ordenar de forma ascendente
      items = items.sort((a, b) => {
        // Verificar si la propiedad es de tipo numérico
        if (
          typeof a[propiedad] === 'number' &&
          typeof b[propiedad] === 'number'
        ) {
          return (a[propiedad] as number) - (b[propiedad] as number);
        } else {
          // Si no es numérica, convertir a string y ordenar alfabéticamente
          return (a[propiedad] as string).localeCompare(b[propiedad] as string);
        }
      });
    } else {
      // Ordenar de forma descendente
      items = items.sort((a, b) => {
        // Verificar si la propiedad es de tipo numérico
        if (
          typeof a[propiedad] === 'number' &&
          typeof b[propiedad] === 'number'
        ) {
          return (b[propiedad] as number) - (a[propiedad] as number);
        } else {
          // Si no es numérica, convertir a string y ordenar alfabéticamente
          return (b[propiedad] as string).localeCompare(a[propiedad] as string);
        }
      });
    }

    return items; // Devolver la lista ordenada
  }
}
