// Пирамидальная сортировка (heap sort)
//
// Как работает: делаем из массива max-кучу, тогда максимум будет в arr[0].
// Меняем его с последним элементом, и максимум оказывается в конце на своём месте.
// Потом считаем, что куча стала на 1 меньше, опускаем новую вершину вниз и повторяем.
//
// Пример: [4, 10, 3, 5, 1]
// - куча: [10, 5, 3, 4, 1]
// - 10 в конец: [5, 4, 3, 1, 10]
// - 5 в конец: [4, 1, 3, 5, 10]
// - и так далее, в конце [1, 3, 4, 5, 10]
//
// Сложность:
// - построить кучу O(n)
// - потом n раз опускаем вершину, каждый раз O(log n)
// - итого O(n log n) всегда, даже в худшем случае (у quick sort худший O(n^2))
// - память O(1), всё делается внутри массива без рекурсии
//   heapSort делает копию, чтобы не менять исходный массив, с копией выходит O(n)
// - сортировка неустойчивая, одинаковые элементы могут поменяться местами
//
// Для сравнения: merge sort тоже O(n log n), но ему нужно O(n) памяти.

import { defaultCompare, type Comparator } from "./compare.ts";

export function heapSort<T>(arr: readonly T[], compare: Comparator<T> = defaultCompare): T[] {
  const copy = [...arr];
  heapSortInPlace(copy, compare);
  return copy;
}

export function heapSortInPlace<T>(arr: T[], compare: Comparator<T> = defaultCompare): T[] {
  const n = arr.length;

  // строим max-кучу
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n, compare);
  }

  // по одному переносим максимум в конец
  for (let end = n - 1; end > 0; end--) {
    swap(arr, 0, end);
    siftDown(arr, 0, end, compare);
  }

  return arr;
}

// опускаем arr[i] вниз, куча это первые size элементов
function siftDown<T>(arr: T[], i: number, size: number, compare: Comparator<T>): void {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < size && compare(arr[left]!, arr[largest]!) > 0) largest = left;
    if (right < size && compare(arr[right]!, arr[largest]!) > 0) largest = right;
    if (largest === i) break;

    swap(arr, i, largest);
    i = largest;
  }
}

function swap<T>(arr: T[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j]!, arr[i]!];
}
