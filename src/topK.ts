// Топ-k элементов массива
//
// Можно просто отсортировать и взять k штук, но это O(n log n).
//
// Как работает топ-k сверху: держим min-кучу из k элементов.
// Наверху лежит самый маленький из найденных больших.
// Если новый элемент больше вершины, вершину выкидываем, а новый кладём.
// В конце в куче остаются k самых больших.
// Топ-k снизу так же, только куча max.
//
// Сложность:
// - каждый элемент один раз проходит через кучу размера k, это O(n log k)
// - в конце ещё достаём k элементов, O(k log k)
// - итого O(n log k), память O(k)
// - если k маленькое, например топ-10 из миллиона, это сильно быстрее сортировки
//
// Топ сверху возвращается по убыванию, топ снизу по возрастанию.

import { defaultCompare, reverse, type Comparator } from "./compare.ts";
import { Heap } from "./heap.ts";

export function topKLargest<T>(arr: readonly T[], k: number, compare: Comparator<T> = defaultCompare): T[] {
  return topK(arr, k, compare);
}

export function topKSmallest<T>(arr: readonly T[], k: number, compare: Comparator<T> = defaultCompare): T[] {
  // самые маленькие это самые большие, если перевернуть компаратор
  return topK(arr, k, reverse(compare));
}

// k самых больших элементов по compare, по убыванию
function topK<T>(arr: readonly T[], k: number, compare: Comparator<T>): T[] {
  if (!Number.isInteger(k) || k < 0) {
    throw new RangeError(`k должно быть целым неотрицательным числом, получено ${k}`);
  }
  if (k === 0) return [];

  const heap = new Heap<T>(compare); // min-куча

  for (const x of arr) {
    if (heap.size < k) {
      heap.push(x);
    } else {
      heap.pushPop(x); // вылетает меньший из x и вершины
    }
  }

  // достаются от меньшего к большему, поэтому в конце reverse
  const result: T[] = [];
  while (!heap.isEmpty()) {
    result.push(heap.pop()!);
  }
  return result.reverse();
}
