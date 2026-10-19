import { describe, expect, test } from "bun:test";
import { defaultCompare } from "./src/compare.ts";
import { Heap, MaxHeap, MinHeap } from "./src/heap.ts";
import { heapSort, heapSortInPlace } from "./src/heapSort.ts";
import { topKLargest, topKSmallest } from "./src/topK.ts";
import { PriorityQueue } from "./src/priorityQueue.ts";

const randomArray = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 1000) - 500);
const byNumber = (a: number, b: number) => a - b;

function drain<T>(heap: Heap<T>): T[] {
  const result: T[] = [];
  while (!heap.isEmpty()) result.push(heap.pop()!);
  return result;
}

describe("defaultCompare", () => {
  test("числа сравниваются как числа, а не как строки", () => {
    expect(defaultCompare(10, 9)).toBeGreaterThan(0);
    expect(defaultCompare(-1, 2)).toBeLessThan(0);
    expect(defaultCompare(1n, 2)).toBeLessThan(0);
    expect(defaultCompare(0, -0)).toBe(0);
  });
  test("порядок типов: boolean < number < NaN < string < Date < null < undefined", () => {
    const mixed = [undefined, "a", null, new Date(0), NaN, 5, true, false, -3];
    expect(heapSort(mixed)).toEqual([false, true, -3, 5, NaN, "a", new Date(0), null, undefined]);
  });
  test("NaN равен NaN, и сортировка с ним не ломается", () => {
    expect(defaultCompare(NaN, NaN)).toBe(0);
    expect(heapSort([3, NaN, 1, NaN, 2])).toEqual([1, 2, 3, NaN, NaN]);
  });
  test("объекты без компаратора - ошибка", () => {
    expect(() => defaultCompare({}, {})).toThrow(TypeError);
    expect(() => heapSort([[1], [2]])).toThrow(TypeError);
  });
});

describe("Heap", () => {
  test("MinHeap отдаёт по возрастанию", () => {
    const heap = new MinHeap<number>();
    [5, 3, 8, 1, 9, 2].forEach((x) => heap.push(x));
    expect(heap.peek()).toBe(1);
    expect(drain(heap)).toEqual([1, 2, 3, 5, 8, 9]);
  });
  test("MaxHeap отдаёт по убыванию", () => {
    const heap = new MaxHeap<number>(defaultCompare, [5, 3, 8, 1, 9, 2]);
    expect(heap.peek()).toBe(9);
    expect(drain(heap)).toEqual([9, 8, 5, 3, 2, 1]);
  });
  test("пустая куча", () => {
    const heap = new MinHeap<number>();
    expect(heap.size).toBe(0);
    expect(heap.peek()).toBeUndefined();
    expect(heap.pop()).toBeUndefined();
  });
  test("свойство кучи после heapify и операций", () => {
    const heap = new MinHeap<number>(byNumber, randomArray(500));
    for (let i = 0; i < 200; i++) heap.pop();
    randomArray(200).forEach((x) => heap.push(x));

    const arr = heap.toArray();
    for (let i = 1; i < arr.length; i++) {
      expect(arr[Math.floor((i - 1) / 2)]!).toBeLessThanOrEqual(arr[i]!);
    }
  });
  test("pushPop", () => {
    const heap = new MinHeap<number>(byNumber, [3, 5, 7]);
    expect(heap.pushPop(1)).toBe(1); // меньше вершины - сразу возвращается
    expect(heap.pushPop(6)).toBe(3);
    expect(drain(heap)).toEqual([5, 6, 7]);
  });
  test("объекты со своим компаратором", () => {
    const heap = new MaxHeap<{ age: number }>((a, b) => a.age - b.age, [{ age: 20 }, { age: 40 }, { age: 30 }]);
    expect(heap.pop()).toEqual({ age: 40 });
  });
});

describe("heapSort", () => {
  test("сортирует числа", () => {
    expect(heapSort([5, 3, 8, 1, 9, 2])).toEqual([1, 2, 3, 5, 8, 9]);
  });
  test("числа сортируются как числа (встроенный sort дал бы [1, 10, 2])", () => {
    expect(heapSort([10, 2, 1])).toEqual([1, 2, 10]);
  });
  test("пустой и одиночный массив", () => {
    expect(heapSort([])).toEqual([]);
    expect(heapSort([1])).toEqual([1]);
  });
  test("дубликаты и отрицательные", () => {
    expect(heapSort([3, -1, 3, 0, -1])).toEqual([-1, -1, 0, 3, 3]);
  });
  test("строки", () => {
    expect(heapSort(["b", "c", "a", "B"])).toEqual(["B", "a", "b", "c"]);
  });
  test("не изменяет исходный массив, а heapSortInPlace - изменяет", () => {
    const arr = [3, 1, 2];
    heapSort(arr);
    expect(arr).toEqual([3, 1, 2]);
    heapSortInPlace(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
  test("совпадает со встроенной сортировкой на случайных данных", () => {
    const arr = randomArray(1000);
    expect(heapSort(arr)).toEqual([...arr].sort(byNumber));
  });
  test("свой компаратор (по убыванию)", () => {
    expect(heapSort([1, 3, 2], (a, b) => b - a)).toEqual([3, 2, 1]);
  });
});

describe("topK", () => {
  const arr = [7, 2, 9, 4, 1, 8, 3];
  test("топ-k сверху по убыванию", () => {
    expect(topKLargest(arr, 3)).toEqual([9, 8, 7]);
  });
  test("топ-k снизу по возрастанию", () => {
    expect(topKSmallest(arr, 3)).toEqual([1, 2, 3]);
  });
  test("k = 0 и k больше длины массива", () => {
    expect(topKLargest(arr, 0)).toEqual([]);
    expect(topKSmallest(arr, 100)).toEqual([1, 2, 3, 4, 7, 8, 9]);
    expect(topKLargest([], 3)).toEqual([]);
  });
  test("дубликаты", () => {
    expect(topKLargest([5, 5, 1, 5, 2], 2)).toEqual([5, 5]);
    expect(topKSmallest([5, 1, 1, 2], 3)).toEqual([1, 1, 2]);
  });
  test("некорректное k", () => {
    expect(() => topKLargest(arr, -1)).toThrow(RangeError);
    expect(() => topKLargest(arr, 1.5)).toThrow(RangeError);
  });
  test("совпадает с сортировкой на случайных данных", () => {
    const data = randomArray(1000);
    const sorted = [...data].sort(byNumber);
    expect(topKSmallest(data, 50)).toEqual(sorted.slice(0, 50));
    expect(topKLargest(data, 50)).toEqual(sorted.slice(-50).reverse());
  });
  test("смешанные типы", () => {
    expect(topKSmallest([3, "a", null, 1, true], 3)).toEqual([true, 1, 3]);
  });
  test("объекты со своим компаратором", () => {
    const users = [{ name: "A", age: 30 }, { name: "B", age: 18 }, { name: "C", age: 45 }];
    expect(topKLargest(users, 1, (a, b) => a.age - b.age)).toEqual([{ name: "C", age: 45 }]);
  });
});

describe("PriorityQueue", () => {
  test("по умолчанию первым выходит больший приоритет", () => {
    const q = new PriorityQueue<string, number>();
    q.enqueue("low", 1);
    q.enqueue("high", 10);
    q.enqueue("mid", 5);
    expect(q.size).toBe(3);
    expect(q.peek()).toBe("high");
    expect(q.peekPriority()).toBe(10);
    expect([q.dequeue(), q.dequeue(), q.dequeue()]).toEqual(["high", "mid", "low"]);
    expect(q.isEmpty()).toBe(true);
    expect(q.dequeue()).toBeUndefined();
  });
  test("order: min - первым выходит меньший приоритет", () => {
    const q = new PriorityQueue<string, number>({ order: "min" });
    q.enqueue("b", 2);
    q.enqueue("a", 1);
    q.enqueue("c", 3);
    expect([q.dequeue(), q.dequeue(), q.dequeue()]).toEqual(["a", "b", "c"]);
  });
  test("при равных приоритетах - в порядке добавления", () => {
    const q = new PriorityQueue<number, number>();
    for (let i = 0; i < 20; i++) q.enqueue(i, i % 2); // нечётные - приоритет 1, чётные - 0
    const result = Array.from({ length: 20 }, () => q.dequeue());
    expect(result).toEqual([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });
  test("приоритет любого типа со своим компаратором", () => {
    const q = new PriorityQueue<string, Date>({ order: "min", compare: (a, b) => a.getTime() - b.getTime() });
    q.enqueue("потом", new Date("2026-12-31"));
    q.enqueue("сначала", new Date("2026-01-01"));
    expect(q.dequeue()).toBe("сначала");
  });
  test("строковые приоритеты через defaultCompare", () => {
    const q = new PriorityQueue<number, string>({ order: "min" });
    q.enqueue(2, "b");
    q.enqueue(1, "a");
    expect(q.dequeue()).toBe(1);
  });
});
