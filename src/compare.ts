// Сравнение элементов любого типа
//
// Данные могут быть any, а на разных типах < и > работают криво.
// Например "10" < "9" это true, а NaN < 1 и NaN > 1 оба false.
// Если так строить кучу, она сломается.
//
// Поэтому везде передаём компаратор compare(a, b), как в обычном sort:
// - меньше 0 -> a меньше b
// - 0 -> равны
// - больше 0 -> a больше b
//
// Если компаратор не передали, берётся defaultCompare. Порядок типов в нём такой:
// boolean < number < NaN < string < Date < null < undefined
// Объекты и массивы так сравнить нельзя, на них кидаем ошибку.

export type Comparator<T> = (a: T, b: T) => number;

// сначала сравниваем типы по этому номеру, потом уже сами значения
function rank(x: unknown): number {
  if (typeof x === "boolean") return 0;
  if (typeof x === "number" || typeof x === "bigint") {
    return Number.isNaN(x) ? 2 : 1; // NaN ставим после всех чисел
  }
  if (typeof x === "string") return 3;
  if (x instanceof Date) return Number.isNaN(x.getTime()) ? 5 : 4; // неправильная дата как NaN
  if (x === null) return 6;
  if (x === undefined) return 7;

  throw new TypeError(
    `Не умею сравнивать значения типа ${Array.isArray(x) ? "array" : typeof x}, передайте свой компаратор`,
  );
}

export function defaultCompare(a: unknown, b: unknown): number {
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;

  // тут типы одинаковые, значит < и > работают нормально
  let x = a as number | bigint | string | boolean;
  let y = b as number | bigint | string | boolean;
  if (a instanceof Date && b instanceof Date) {
    x = a.getTime();
    y = b.getTime();
  }

  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
}

// переворачиваем компаратор, чтобы из min-кучи получить max-кучу
export function reverse<T>(compare: Comparator<T>): Comparator<T> {
  return (a, b) => compare(b, a);
}
