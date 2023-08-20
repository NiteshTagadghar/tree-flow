import "./App.css";
import EmployeeOrgApp from "./EmployeeOrgApp";
import { useState } from "react";

const App = () => {
  interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
  }
  const [ceo, setCeo] = useState<Employee>({
    uniqueId: 1,
    name: "John Smith",
    subordinates: [
      {
        uniqueId: 2,
        name: "Margot Donald",
        subordinates: [
          {
            uniqueId: 4,
            name: "Cassandra Reynolds",
            subordinates: []
          },
          {
            uniqueId: 5,
            name: "Mary Blue",
            subordinates: []
          }
        ]
      },
      {
        uniqueId: 3,
        name: "Tyler Simpson",
        subordinates: [
          {
            uniqueId: 6,
            name: "Harry Tobs",
            subordinates: []
          },
          {
            uniqueId: 7,
            name: "Thomas Brown",
            subordinates: []
          }
        ]
      }
    ]
  });

  const [history, setHistory] = useState<Employee[][]>([
    JSON.parse(JSON.stringify(ceo))
  ]);
  const [future, setFuture] = useState<Employee[][]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const handleMove = (employeeID: number, supervisorID: number): void => {
    const rootCopy = JSON.parse(JSON.stringify(ceo));

    const findEmployee = (
      root: Employee,
      targetID: number
    ): Employee | null => {
      if (root.uniqueId === targetID) return root;
      for (const sub of root.subordinates) {
        const found = findEmployee(sub, targetID);
        if (found) return found;
      }
      return null;
    };

    let movedEmployee: Employee | null = null;
    const traverseAndUpdate = (root: Employee) => {
      for (let i = 0; i < root.subordinates.length; i++) {
        const sub = root.subordinates[i];
        if (sub.uniqueId === employeeID) {
          movedEmployee = root.subordinates.splice(i, 1)[0];
          break;
        }
        traverseAndUpdate(sub);
      }
    };

    traverseAndUpdate(rootCopy);

    if (movedEmployee) {
      const newSupervisor = findEmployee(rootCopy, supervisorID);
      if (newSupervisor) {
        newSupervisor.subordinates.push(movedEmployee);
        setHistory([...history, [JSON.parse(JSON.stringify(rootCopy))]]);
        setFuture([]); // Clear future history
        setCurrentEmployee(null);
        setCeo(rootCopy);
      }
    }
  };

  const undo = (): void => {
    if (history.length > 1) {
      const currentState = history.pop()!;
      setFuture([...future, currentState]);
      setCurrentEmployee(null);
      setHistory(history);
      setCeo(currentState[0]);
    }
  };

  const redo = (): void => {
    if (future.length > 0) {
      const nextState = future.pop()!;
      setHistory([...history, nextState]);
      setCurrentEmployee(null);
      setFuture(future);
      setCeo(nextState[0]);
    }
  };

  return (
    <div className="app-container">
      <EmployeeOrgApp ceo={ceo} move={handleMove} undo={undo} redo={redo} />
    </div>
  );
};
export default App;
