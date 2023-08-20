import React, { useState } from "react";

interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

interface IEmployeeOrgApp {
  ceo: Employee;
  move(employeeID: number, supervisorID: number): void;
  undo(): void;
  redo(): void;
}

const EmployeeOrgApp: React.FC<IEmployeeOrgApp> = ({
  ceo,
  move,
  undo,
  redo
}) => {
  const [history, setHistory] = useState<Employee[][]>([
    JSON.parse(JSON.stringify(ceo))
  ]);
  const [future, setFuture] = useState<Employee[][]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [highlightedSubordinate, setHighlightedSubordinate] = useState<
    number | null
  >(null);

  const handleEmployeeClick = (employee: Employee): void => {
    setCurrentEmployee(employee);
    setHighlightedSubordinate(null); // Clear the highlight
  };

  const handleSubordinateClick = (subordinate: Employee): void => {
    if (currentEmployee) {
      setHighlightedSubordinate(subordinate.uniqueId); // Highlight the subordinate
    }
  };

  const handleMoveSubordinate = (subordinate: Employee): void => {
    if (currentEmployee) {
      setHighlightedSubordinate(subordinate.uniqueId);
      move(subordinate.uniqueId, currentEmployee.uniqueId);
      setCurrentEmployee(null);

      // Apply move animation
      setTimeout(() => {
        setHighlightedSubordinate(null);
      }, 300); // Remove the highlight after the animation duration
    }
  };

  const renderEmployeeTree = (employee: Employee): JSX.Element => (
    <div
      className={`employee ${
        highlightedSubordinate === employee.uniqueId ? "move-animation" : ""
      }`}
      key={employee.uniqueId}
    >
      <div
        className={`employee-name ${
          highlightedSubordinate === employee.uniqueId ? "highlighted" : ""
        }`}
      >
        <div onClick={() => handleEmployeeClick(employee)}>
          {employee.name}
          {employee.subordinates.length > 0 && <span className="arrow">▼</span>}
        </div>
        {highlightedSubordinate === employee.uniqueId && (
          <button
            className="move-button"
            onClick={() => handleMoveSubordinate(employee)}
          >
            Move
          </button>
        )}
      </div>
      {employee.subordinates.length > 0 && (
        <div className="subordinates">
          {employee.subordinates.map((subordinate) => (
            <div key={subordinate.uniqueId}>
              <div
                className={`subordinate ${
                  highlightedSubordinate === subordinate.uniqueId
                    ? "highlighted"
                    : ""
                }`}
                onClick={() => handleSubordinateClick(subordinate)}
              >
                {subordinate.name}
                {highlightedSubordinate === subordinate.uniqueId && (
                  <button
                    className="move-button"
                    onClick={() => handleMoveSubordinate(subordinate)}
                  >
                    Move
                  </button>
                )}
              </div>
              {renderEmployeeTree(subordinate)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="tree">
      <h1>Employee Organization Chart</h1>
      {renderEmployeeTree(ceo)}
      {currentEmployee && (
        <div>
          <h2>Add subordinate to: {currentEmployee.name}</h2>
          {currentEmployee.subordinates.map((subordinate) => (
            <div key={subordinate.uniqueId}>{subordinate.name}</div>
          ))}
        </div>
      )}
      <div className="buttons">
        <button className="undo-button" onClick={undo}>
          Undo
        </button>
        <button className="redo-button" onClick={redo}>
          Redo
        </button>
      </div>
    </div>
  );
};

export default EmployeeOrgApp;
