// Куча (Heap)
//
// Куча - это двоичное дерево, где родитель всегда не хуже детей:
// - Min Heap: родитель <= детей, наверху минимум
// - Max Heap: родитель >= детей, наверху максимум
//
// Храним её в обычном массиве. Для элемента с индексом i:
// - родитель (i - 1) / 2 с округлением вниз
// - дети 2i + 1 и 2i + 2
// Например [1, 3, 2, 7, 4] - у 1 дети 3 и 2, у 3 дети 7 и 4.
//
// Как работает:
// - push: кладём в конец и поднимаем вверх, пока он меньше родителя (siftUp)
// - pop: берём вершину, на её место ставим последний и опускаем вниз (siftDown)
// - peek: просто heap[0]
//
// Сложность:
// - высота дерева примерно log2(n)
// - peek O(1)
// - push и pop O(log n), элемент идёт максимум от низа до верха
// - построение из массива O(n), потому что большинство элементов внизу и им почти некуда опускаться
// - память O(n) на массив
//
// Heap сделан как min-куча по компаратору, MaxHeap это она же с перевёрнутым компаратором.

import { defaultCompare, reverse, type Comparator } from "./compare.ts";

export class Heap<T> {
  protected heap: T[] = [];
  protected compare: Comparator<T>;

  constructor(compare: Comparator<T> = defaultCompare, items: Iterable<T> = []) {
    this.compare = compare;
    this.heap = [...items];

    // делаем кучу из массива: опускаем все элементы, у которых есть дети, с конца
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  push(value: T): void {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    const top = this.heap[0]!;
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  // push и сразу pop, но за один проход
  pushPop(value: T): T {
    if (this.heap.length === 0 || this.compare(value, this.heap[0]!) <= 0) {
      return value; // он бы сразу стал вершиной и вылетел
    }
    const top = this.heap[0]!;
    this.heap[0] = value;
    this.siftDown(0);
    return top;
  }

  toArray(): T[] {
    return [...this.heap];
  }

  // элемент i должен быть выше элемента j
  private less(i: number, j: number): boolean {
    return this.compare(this.heap[i]!, this.heap[j]!) < 0;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j]!, this.heap[i]!];
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (!this.less(i, parent)) break; // встал на место
      this.swap(i, parent);
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let best = i;

      if (left < n && this.less(left, best)) best = left;
      if (right < n && this.less(right, best)) best = right;
      if (best === i) break; // дети не меньше, значит встал на место

      this.swap(i, best);
      i = best;
    }
  }
}

export class MinHeap<T> extends Heap<T> {
  constructor(compare: Comparator<T> = defaultCompare, items: Iterable<T> = []) {
    super(compare, items);
  }
}

export class MaxHeap<T> extends Heap<T> {
  constructor(compare: Comparator<T> = defaultCompare, items: Iterable<T> = []) {
    super(reverse(compare), items);
  }
}
