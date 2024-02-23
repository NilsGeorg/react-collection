import { useEffect, useRef, useState } from "react";
import "./memory.scss";
import backgroundImg from './assets/background.jpg'

interface MemoryRecord {
  id: string;
  name: string;
  visible: boolean;
  solved: boolean;
  wrong: boolean;
}

interface Timer {
  StartDate: number;
  EndDate: number;
  IsRunning: boolean;
}

const imageImports = import.meta.glob<{ default: string }>(
  "./assets/tiles/n*.png",
  { eager: true }
);
const imagePaths = Object.values(imageImports).map((val) => val.default);

function createMemorySet(): MemoryRecord[] {
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

function Memory() {
  const [memorySet, setMemory] = useState<MemoryRecord[]>(createMemorySet);
  const [timer, setTimer] = useState<Timer>(() => {
    return { StartDate: 0, EndDate: 0, IsRunning: false };
  });
  const [firstPicked, setFirstPicked] = useState<MemoryRecord>();
  const [secondPicked, setSecondPicked] = useState<MemoryRecord>();

  const timerRef = useRef(timer);
  timerRef.current = timer;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timerRef.current.IsRunning) {
        setTimer((prev) => {
          return { ...prev, EndDate: Date.now() };
        });
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function resetGame() {
    setTimer({ StartDate: 0, EndDate: 0, IsRunning: false });
    setFirstPicked(undefined);
    setSecondPicked(undefined);
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

  function onClickMemoryTile(record: MemoryRecord) {
    if (!timer.IsRunning) {
      setTimer({ StartDate: Date.now(), IsRunning: true, EndDate: Date.now() });
    }

    if (firstPicked && secondPicked) {
      resetPicks();
      return;
    }

    if (record.solved) {
      return;
    }

    if (firstPicked == record) {
      return;
    }

    record.visible = true;

    if (!firstPicked) {
      setFirstPicked(record);
      return;
    }

    if (!isPair(firstPicked, record)) {
      firstPicked.wrong = true;
      record.wrong = true;

      setSecondPicked(record);
      return;
    }

    firstPicked.solved = true;
    record.solved = true;
    resetPicks();

    if (isSolved(memorySet)) {
      setTimer((prev) => {
        return { ...prev, EndDate: Date.now(), IsRunning: false };
      });
    }
  }

  return (
    <div id="memory" className="fun-font container text-center">
      <h1>Memory</h1>
      <div className="row justify-content-center">
        <div className="col">
          <button
            className="btn btn-success text-white m-1"
            onClick={() => {
              resetGame();
              setMemory((prev) => solve(prev));
            }}
          >
            Solve
          </button>

          <button
            className="btn btn-primary m-1"
            onClick={() => {
              resetGame();
              setMemory(createMemorySet);
            }}
          >
            New Game
          </button>
          <button
            className="btn btn-danger m-1"
            onClick={() => {
              resetGame();
              setMemory((prev) => reset(prev));
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col">
          <Timer timer={timer} /> Seconds
        </div>
      </div>

      <div className="row justify-content-center">
        {memorySet.map((val) => {
          return (
            <div
              key={val.id}
              onClick={() => {
                onClickMemoryTile(val);
              }}
              className="col-md-2 col-3 p-1"
              >
              
              <Tile  mem={val}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tile({ mem }: { mem: MemoryRecord }) {
  let img = backgroundImg
  if (mem.visible || mem.solved) {
    img = mem.name
  } 

  let className = "img-fluid" 

  if (mem.solved) {
    className += " mem-success";
  } 
  
  if (mem.wrong) {
    className += " mem-fail";
  } 

  return <img src={img} className={className} />
}

function Timer({ timer }: { timer: Timer }) {
  let time;

  if (timer.EndDate == 0 || timer.StartDate == 0) {
    time = 0;
  } else {
    time = timer.EndDate - timer.StartDate;
  }

  return <span>{Math.ceil(time / 1000)}</span>;
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

function isSolved(mem: MemoryRecord[]): boolean {
  return !mem.some((val) => !val.solved);
}

export default Memory;
