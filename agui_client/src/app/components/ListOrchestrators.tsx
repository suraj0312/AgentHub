// import React, { useMemo, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// // import "ag-grid-community/styles/ag-grid.css";
// // import "ag-grid-community/styles/ag-theme-alpine.css";
// import styles from "./ListOrchestrators.module.css";
// // import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';  
// import { myTheme } from "./AgGridTheme";  

// // ModuleRegistry.registerModules([ AllCommunityModule ])

// export default function ListOrchestrators({ agents, onDeleteOrchestrator, onEditOrchestrator }) {
//     const gridRef = useRef();

//     const columns = useMemo(() => [
//         { headerName: "Orchestrator Name", field: "name", sortable: true, filter: true },
//         { headerName: "System Instructions", field: "instructions", flex: 1, wrapText: true, autoHeight: true, resizable: true },
//         { headerName: "Sub Agents", field: "subAgents", flex: 0.5, wrapText: true, autoHeight: true, resizable: true, valueGetter: params => params.data.subAgents?.map(a => a.name).join(", ") },
//         {
//         headerName: "Configure",
//         field: "edit",
//         cellRenderer: (params) => (
//             <button
//             className={styles.editBtn}
//             onClick={() => onEditOrchestrator(params.data)}
//             >
//                 <svg fill="#aaaaaaff" width='24px' height='24px' viewBox="-2 2 28 28" version="1.1" stroke="#aaaaaaff" strokeWidth="0.288">
//                     <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
//                     <g id="SVGRepo_iconCarrier">
//                         <title>edit</title> 
//                         <path d="M17.438 22.469v-4.031l2.5-2.5v7.344c0 1.469-1.219 2.688-2.656 2.688h-14.625c-1.469 0-2.656-1.219-2.656-2.688v-14.594c0-1.469 1.188-2.688 2.656-2.688h14.844v0.031l-2.5 2.469h-11.5c-0.531 0-1 0.469-1 1.031v12.938c0 0.563 0.469 1 1 1h12.938c0.531 0 1-0.438 1-1zM19.813 7.219l2.656 2.656 1.219-1.219-2.656-2.656zM10.469 16.594l2.625 2.656 8.469-8.469-2.625-2.656zM8.594 21.094l3.625-0.969-2.656-2.656z"></path> 
//                     </g>
//                 </svg>
//             </button>
//         ),
//         width: 100,
//         pinned: "right",
//         cellStyle: {"display": "flex", "justifyContent": "center", "alingItem": "center"}
//         },
//         {
//         headerName: "Delete",
//         field: "delete",
//         cellRenderer: (params) => (
//             <button
//             className={styles.deleteBtn}
//             onClick={() => onDeleteOrchestrator(params.data)}
//             >
//                 <svg fill="#aaaaaaff" height="32" width="32" viewBox="-5 -5 32 32" stroke="#aaaaaaff" strokeWidth="0.00024000000000000003">
//                     <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
//                     <g id="SVGRepo_iconCarrier">
//                         <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z">
//                         </path>
//                     </g>
//                 </svg>
//             </button>
//         ),
//         width: 120,
//         pinned: "right",
//         cellStyle: {"display": "flex", "justifyContent": "center", "alingItem": "center"}
//         }
//     ], [onDeleteOrchestrator, onEditOrchestrator]);

//     return (
//     <div className={styles.Window}>
//         <div className={styles.headerContainer}>
//             <div className={styles.headerContent}>
//                 <h2 className={styles.title}>Available Orchestrators</h2>
//             </div>
//         </div>
//         <div className={styles.separator}></div>
//         <div className={`${styles.tableContainer} ${styles.customScrollbar}`}>
//             <AgGridReact
//                 theme = {myTheme}
//                 ref={gridRef}
//                 rowData={agents.filter(o => o.type === "orchestrator")}
//                 columnDefs={columns}
//                 domLayout="autoHeight"
//                 rowSelection="single"
//                 suppressMovableColumns={true}
//             />
//         </div>
//     </div>
//     );
// }




import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import styles from "./ListOrchestrators.module.css";
import { myTheme } from "./AgGridTheme";
import { ColDef } from "ag-grid-community";

interface Agent {
  name: string;
  url: string;
  type: string;
  description?: string;
  instructions?: string;
  framework?: string;
  session_id?: string;
  subAgents?: Agent[];
}

interface Orchestrator extends Agent {
  instructions?: string;
  subAgents?: Agent[];
}

interface ListOrchestratorsProps {
  agents: Orchestrator[];
  onDeleteOrchestrator: (agent: Orchestrator) => void;
  onEditOrchestrator: (agent: Orchestrator) => void;
}

export default function ListOrchestrators({
  agents,
  onDeleteOrchestrator,
  onEditOrchestrator,
}: ListOrchestratorsProps) {
  const gridRef = useRef<AgGridReact<Orchestrator>>(null);

  const columns:ColDef<Agent>[] = useMemo(
    () => [
      {
        headerName: "Orchestrator Name",
        field: "name",
        sortable: true,
        filter: true,
      },
      {
        headerName: "System Instructions",
        field: "instructions",
        flex: 1,
        wrapText: true,
        autoHeight: true,
        resizable: true,
      },
      {
        headerName: "Sub Agents",
        field: "subAgents",
        flex: 0.5,
        wrapText: true,
        autoHeight: true,
        resizable: true,
        valueGetter: (params: any) =>
          params.data.subAgents?.map((a: Agent) => a.name).join(", ") || "None",
      },
      {
        headerName: "Configure",
        // field: "edit",
        cellRenderer: (params: any) => (
          <button
            className={styles.editBtn}
            onClick={() => onEditOrchestrator(params.data)}
            aria-label={`Edit orchestrator ${params.data.name}`}
          >
            <svg
              fill="#aaaaaa"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              stroke="#aaaaaa"
              strokeWidth="0.5"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
            </svg>
          </button>
        ),
        width: 100,
        pinned: "right",
        cellStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
      {
        headerName: "Delete",
        // field: "delete",
        cellRenderer: (params: any) => (
          <button
            className={styles.deleteBtn}
            onClick={() => onDeleteOrchestrator(params.data)}
            aria-label={`Delete orchestrator ${params.data.name}`}
          >
            <svg
              fill="#aaaaaa"
              height="24"
              width="24"
              viewBox="0 0 24 24"
              stroke="#aaaaaa"
              strokeWidth="0.5"
            >
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        ),
        width: 120,
        pinned: "right",
        cellStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    ],
    [onDeleteOrchestrator, onEditOrchestrator]
  );

  return (
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Available Orchestrators</h2>
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={`${styles.tableContainer} ${styles.customScrollbar}`}>
        <AgGridReact
        theme={myTheme}
          ref={gridRef}
          rowData={agents.filter((o) => o.type === "orchestrator")}
          columnDefs={columns}
          domLayout="autoHeight"
          rowSelection="single"
          suppressMovableColumns={true}
        />
      </div>
    </div>
  );
}