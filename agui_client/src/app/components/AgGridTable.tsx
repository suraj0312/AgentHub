// "use client"
// import React, { useMemo } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { myTheme } from "./AgGridTheme";
// import styles from"./AgGridTable.module.css";

// export default function AgGridTable({ agents, selected, setSelected }) {
//     const columns = useMemo(() => [
//     {
//         headerName: "",
//         field: "checkbox",
//         width: 50,
//         cellRenderer: (params) => (
//         <input
//             type="checkbox"
//             checked={selected.includes(params.data.name + params.data.url)}
//             onChange={() => {
//                 const key = params.data.name + params.data.url;
//                 setSelected(prev =>
//                 prev.includes(key)
//                     ? prev.filter(k => k !== key)
//                     : [...prev, key]
//                 );
//             }}
//         />
//         ),
//         pinned: "left",
//         cellStyle: {"display": "flex", "justifyContent": "center"}
//         },
//         { headerName: "Agent Name", field: "name", flex: 0.3, wrapText: true, autoHeight: true, resizable: true},
//         { headerName: "Description", field: "description", flex: 1, wrapText: true, autoHeight: true, resizable: true },
//         { header: "Agent Framework", field: "framework", flex:0.5, pinned: "right" },
//     ], [selected, setSelected]);


//     return (
//         <div className={styles.tableDiv}>
//             <AgGridReact
//                 theme={myTheme}
//                 // rowData={agents.filter(a => a.type === "a2a_agent")}
//                 rowData={agents}
//                 columnDefs={columns}
//                 domLayout="autoHeight"
//                 suppressMovableColumns={true}
//             />
//         </div>
//     );
//     }





"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { myTheme } from "./AgGridTheme";
import styles from "./AgGridTable.module.css";
import { ColDef } from "ag-grid-community";

interface Agent {
  name: string;
  url: string;
  type: string;
  description?: string;
  framework?: string;
}

interface AgGridTableProps {
  agents: Agent[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function AgGridTable({
  agents,
  selected,
  setSelected,
}: AgGridTableProps) {
  const columns:ColDef<Agent>[] = useMemo(
    () => [
      {
        headerName: "",
        // field: "checkbox",
        width: 50,
        cellRenderer: (params: any) => {
          const key = params.data.name + params.data.url;
          return (
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => {
                setSelected((prev) =>
                  prev.includes(key)
                    ? prev.filter((k) => k !== key)
                    : [...prev, key]
                );
              }}
              aria-label={`Select agent ${params.data.name}`}
            />
          );
        },
        pinned: "left",
        cellStyle: { display: "flex", justifyContent: "center" },
      },
      {
        headerName: "Agent Name",
        field: "name",
        flex: 0.3,
        wrapText: true,
        autoHeight: true,
        resizable: true,
      },
      {
        headerName: "Description",
        field: "description",
        flex: 1,
        wrapText: true,
        autoHeight: true,
        resizable: true,
      },
      {
        headerName: "Agent Framework",
        field: "framework",
        flex: 0.5,
        pinned: "right",
      },
    ],
    [selected, setSelected]
  );

  return (
    <div className={styles.tableDiv}>
      <AgGridReact
        theme={myTheme}
        rowData={agents}
        columnDefs={columns}
        domLayout="autoHeight"
        suppressMovableColumns={true}
      />
    </div>
  );
}