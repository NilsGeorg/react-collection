import { useState } from "react";
import "./Memory.css";
import { Memory, MemoryRecord } from "./Memory";

const imageImports = import.meta.glob<{ default: string }>(
  "./assets/tiles/*.png",
  { eager: true }
);

function createMemorySet(): MemoryRecord[] {
  const imagePaths = Object.values(imageImports).map((val) => val.default);
  const memory = [...imagePaths, ...imagePaths];
  shuffleArray(memory);

  return memory.map((m) => {
    return {
      id: crypto.randomUUID(),
      name: m,
      visible: false,
      solved: false,
      wrong: false,
    };
  });
}

function MemoryPage() {
  const [memorySet, setMemory] = useState<MemoryRecord[]>(createMemorySet);

  return (
    <>
      <h1>Memory</h1>
      <button
        className="success"
        onClick={() => setMemory((prev) => solve(prev))}
      >
        Solve
      </button>
      <button className="primary" onClick={() => setMemory(createMemorySet)}>
        New Game
      </button>
      <button
        className="danger"
        onClick={() => setMemory((prev) => reset(prev))}
      >
        Reset
      </button>
      <Memory data={memorySet}></Memory>
    </>
  );
}

function solve(records: MemoryRecord[]): MemoryRecord[] {
  return records.map((memoryRecord) => {
    return {
      ...memoryRecord,
      visible: false,
      solved: true,
      wrong: false,
    };
  });
}

function reset(records: MemoryRecord[]): MemoryRecord[] {
  return records.map((memoryRecord) => {
    return {
      ...memoryRecord,
      visible: false,
      solved: false,
      wrong: false,
    };
  });
}

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default MemoryPage;
