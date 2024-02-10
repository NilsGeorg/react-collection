import { useState } from "react";

export type MemoryRecord = {
  id: string;
  name: string;
  visible: boolean;
  solved: boolean;
  wrong: boolean;
};

export function Game(memory: { data: MemoryRecord[] }) {
  const [firstPicked, setFirstPicked] = useState<MemoryRecord>();
  const [secondPicked, setSecondPicked] = useState<MemoryRecord>();

  return (
    <div className="grid">
      {memory.data.map((val) => {
        return (
          <div
            key={val.id}
            onClick={() => {
              if (firstPicked && secondPicked) {
                resetVisibility(firstPicked);
                resetVisibility(secondPicked);

                setFirstPicked(undefined);
                setSecondPicked(undefined);

                return;
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

                setFirstPicked(undefined);
                setSecondPicked(undefined);
              } else {
                firstPicked.wrong = true;
                val.wrong = true;

                setSecondPicked(val);
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
  );
}

function isPair(first: MemoryRecord, second: MemoryRecord): boolean {
  return first.name == second.name;
}

function resetVisibility(mem: MemoryRecord) {
  mem.visible = false;
  mem.wrong = false;
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
