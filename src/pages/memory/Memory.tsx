import { useEffect, useState } from "react";
import "./Memory.css";

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

type MemoryRecord = {
  id: string;
  name: string;
  visible: boolean;
  solved: boolean;
  wrong: boolean;
};

interface Timer {
  StartDate: number
  EndDate: number
  IsRunning: boolean
}

function Memory() {
  const [memorySet, setMemory] = useState<MemoryRecord[]>(createMemorySet);
  const [timer, setTimer] = useState<Timer>(() => { return { StartDate: 0, EndDate: 0, IsRunning: false } })
  const [clock, setClock] = useState<number>(0)
  const [firstPicked, setFirstPicked] = useState<MemoryRecord>();
  const [secondPicked, setSecondPicked] = useState<MemoryRecord>();

  useEffect(() => {
    const intervalId = setInterval(() => { setClock(Date.now()) }, 1000);
    return () => { clearInterval(intervalId); };
  }, []);

  function resetGame() {
    setTimer({ StartDate: 0, EndDate: 0, IsRunning: false })
    setFirstPicked(undefined)
    setSecondPicked(undefined)
  }

  function resetPicks() {
    if (firstPicked) {
      firstPicked.visible = false;
      firstPicked.wrong = false;
      setFirstPicked(undefined);
    }

    if (secondPicked) {
      secondPicked.visible = false;
      secondPicked.wrong = false;
      setSecondPicked(undefined);
    }
  }

  return (
    <>
      <h1>Memory</h1>
      <button
        className="success"
        onClick={() => {
          resetGame()
          setMemory((prev) => solve(prev))
        }}
      >
        Solve
      </button>
      <button className="primary" onClick={() => {
        resetGame()
        setMemory(createMemorySet)
      }
      }>
        New Game
      </button>
      <button
        className="danger"
        onClick={() => {
          resetGame()
          setMemory((prev) => reset(prev))
        }}
      >
        Reset
      </button>
      <br />
      <Timer timer={timer} clock={clock} />

      <br />
      <div className="grid">
      {memorySet.map((val) => {
        return (
          <div
            key={val.id}
            onClick={() => {
              if (!timer.IsRunning) {
                setTimer(prev => { return { ...prev, StartDate: Date.now(), IsRunning: true } })
              }

              if (firstPicked && secondPicked) {
                resetPicks()
                return
              }

              if (val.solved) {
                return;
              }

              if (firstPicked == val) {
                return;
              }

              val.visible = true;

              if (!firstPicked) {
                setFirstPicked(val);
                return;
              }

              if (isPair(firstPicked, val)) {
                firstPicked.solved = true;
                val.solved = true;

                resetPicks()
              } else {
                firstPicked.wrong = true;
                val.wrong = true;

                setSecondPicked(val);
              }

              if (isSolved(memorySet)) {
                setTimer(prev => { return { ...prev, EndDate: Date.now(), IsRunning: false } })
              }
            }}
            className={getMemoryClasses(val)}
          >
            {(val.visible || val.solved) && (
              <img className="memory-img" src={val.name} alt={val.name} />
            )}
          </div>
        );
      })}
    </div>
    </>
  );
}

function Timer(data: { timer: Timer, clock: number }) {
  let time
  if (data.timer.IsRunning && data.timer.StartDate > 0) {
    time = data.clock - data.timer.StartDate
  } else if (data.timer.IsRunning || (data.timer.EndDate < 0 && data.timer.StartDate < 0)) {
    time = 0
  } else {
    time = data.timer.EndDate - data.timer.StartDate
  }

  return <span>{Math.ceil(time / 1000)}</span>
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

function isPair(first: MemoryRecord, second: MemoryRecord): boolean {
  return first.name == second.name;
}

function isSolved(mem: MemoryRecord[]): boolean{
  return !mem.some((val) => !val.solved)
}

function getMemoryClasses(mem: MemoryRecord): string {
  const classNames: string[] = ["tile"];
  if (mem.solved) {
    classNames.push("solved");
  } else if (mem.wrong) {
    classNames.push("wrong");
    classNames.push("horizontal-shake");
  } else if (!mem.visible) {
    classNames.push("hidden");
  } else {
    classNames.push("neutral");
  }

  return classNames.join(" ");
}


export default Memory;
