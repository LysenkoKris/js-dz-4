import { heapSort } from "./src/heapSort.ts";
import { topKLargest, topKSmallest } from "./src/topK.ts";
import { PriorityQueue } from "./src/priorityQueue.ts";

// превращаем строку '[5, "b", true, null, 3]' в массив, элементы любого типа
function askArray(question: string): unknown[] | null {
  const input = prompt(question) ?? "";
  try {
    const arr = JSON.parse(input);
    if (Array.isArray(arr)) return arr;
  } catch {}
  console.log('Ошибка: нужно ввести массив в формате JSON, например [5, "b", true, null, 3]');
  return null;
}

function askK(): number | null {
  const answer = (prompt("Сколько элементов взять (k)?") ?? "").trim();
  const k = Number(answer);
  if (answer === "" || !Number.isInteger(k) || k < 0) {
    console.log("Ошибка: k должно быть целым неотрицательным числом");
    return null;
  }
  return k;
}

// на объектах defaultCompare кидает ошибку, чтобы программа не падала ловим её тут
function safely(fn: () => void) {
  try {
    fn();
  } catch (e) {
    console.log("Ошибка:", e instanceof Error ? e.message : e);
  }
}

function runSort() {
  const arr = askArray('Введите массив, например [5, "b", true, null, 3, "a", -1]:');
  if (arr === null) return;
  safely(() => console.log("Отсортировано:", heapSort(arr)));
}

function runTopK(largest: boolean) {
  const arr = askArray("Введите массив, например [7, 2, 9, 4, 1, 8]:");
  if (arr === null) return;
  const k = askK();
  if (k === null) return;

  safely(() => {
    const result = largest ? topKLargest(arr, k) : topKSmallest(arr, k);
    console.log(largest ? `Топ-${k} сверху:` : `Топ-${k} снизу:`, result);
  });
}

function runQueue() {
  const queue = new PriorityQueue<string>();
  console.log("Очередь с приоритетом: чем больше приоритет, тем раньше выйдет задача");

  while (true) {
    console.log(`В очереди: ${queue.size}`);
    console.log("1 - Добавить задачу");
    console.log("2 - Достать задачу");
    console.log("3 - Посмотреть следующую");
    console.log("0 - Назад");

    const choice = prompt("Выберите пункт:");

    if (choice === "1") {
      const name = prompt("Название задачи:") ?? "";
      const answer = (prompt("Приоритет (число):") ?? "").trim();
      const priority = Number(answer);
      if (answer === "" || Number.isNaN(priority)) {
        console.log("Ошибка: приоритет должен быть числом");
        continue;
      }
      queue.enqueue(name, priority);
    } else if (choice === "2" || choice === "3") {
      if (queue.isEmpty()) {
        console.log("Очередь пуста");
        continue;
      }
      const priority = queue.peekPriority();
      const name = choice === "2" ? queue.dequeue() : queue.peek();
      console.log(`${choice === "2" ? "Достали" : "Следующая"}: "${name}" (приоритет ${priority})`);
    } else if (choice === "0" || choice === null) break;
    else console.log("Нет такого пункта");
  }
}

while (true) {
  console.log("1 - Пирамидальная сортировка");
  console.log("2 - Топ-k сверху");
  console.log("3 - Топ-k снизу");
  console.log("4 - Очередь с приоритетом");
  console.log("0 - Выход");

  const choice = prompt("Выберите пункт:");

  if (choice === "1") runSort();
  else if (choice === "2") runTopK(true);
  else if (choice === "3") runTopK(false);
  else if (choice === "4") runQueue();
  else if (choice === "0" || choice === null) break;
  else console.log("Нет такого пункта");
}
