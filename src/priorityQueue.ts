// Очередь с приоритетом (Priority Queue)
//
// Обычная очередь отдаёт элементы в порядке добавления.
// Очередь с приоритетом отдаёт первым элемент с самым большим приоритетом.
//
// Как работает: внутри куча из { value, priority, order }.
// - по умолчанию первым выходит больший приоритет, с { order: "min" } меньший
// - приоритет может быть любого типа, сравнивается через компаратор
// - order это номер добавления. Куча неустойчивая, поэтому при равных приоритетах
//   сравниваем order, чтобы первым выходил тот, кто раньше пришёл
//
// Сложность:
// - enqueue O(log n)
// - dequeue O(log n)
// - peek, size, isEmpty O(1)
// - память O(n)
//
// Для сравнения: на отсортированном массиве вставка была бы O(n),
// а на обычном массиве поиск максимума O(n).

import { defaultCompare, type Comparator } from "./compare.ts";
import { Heap } from "./heap.ts";

type Entry<T, P> = { value: T; priority: P; order: number };

export type PriorityQueueOptions<P> = {
  order?: "max" | "min"; // кто выходит первым
  compare?: Comparator<P>; // сравнение приоритетов
};

export class PriorityQueue<T, P = unknown> {
  private heap: Heap<Entry<T, P>>;
  private counter = 0;

  constructor({ order = "max", compare = defaultCompare }: PriorityQueueOptions<P> = {}) {
    const sign = order === "max" ? -1 : 1;

    this.heap = new Heap<Entry<T, P>>((a, b) => {
      const byPriority = sign * compare(a.priority, b.priority);
      if (byPriority !== 0 && !Number.isNaN(byPriority)) return byPriority;
      return a.order - b.order; // приоритеты равны, смотрим кто раньше
    });
  }

  get size(): number {
    return this.heap.size;
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  enqueue(value: T, priority: P): void {
    this.heap.push({ value, priority, order: this.counter++ });
  }

  dequeue(): T | undefined {
    return this.heap.pop()?.value;
  }

  peek(): T | undefined {
    return this.heap.peek()?.value;
  }

  peekPriority(): P | undefined {
    return this.heap.peek()?.priority;
  }
}
