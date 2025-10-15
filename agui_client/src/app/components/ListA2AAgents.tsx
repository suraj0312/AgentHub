import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import styles from "./ListA2AAgents.module.css";
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';    

// ModuleRegistry.registerModules([ AllCommunityModule ])
import { myTheme } from "./AgGridTheme";

export default function ListA2AAgents({ agents, onDeleteAgent }) {
  const gridRef = useRef();

  const columns = useMemo(() => [
    { headerName: "Agent Name", field: "name", sortable: true, filter: true },
    { headerName: "Description", field: "description", flex: 1, wrapText: true, autoHeight: true, resizable: true },
    { headerName: "Agent Url", field: "url", flex: 1, wrapText: true, autoHeight: true, resizable: true },
    { header: "Agent Framework", field: "framework", flex:1 },
    {
      headerName: "Delete",
      field: "delete",
      cellRenderer: (params) => (
        <button
          className={styles.deleteBtn}
          onClick={() => onDeleteAgent(params.data)}
        >
          <svg fill="#aaaaaaff" height="32"width="32" viewBox="-5 -5 32 32" stroke="#aaaaaaff" strokeWidth="0.00024000000000000003">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z">
                </path>
            </g>
          </svg>
        </button>
      ),
      width: 80,
      pinned: "right",
      cellStyle: {"display": "flex", "justifyContent": "center", "alingItem": "center"}
    }
  ], [onDeleteAgent]);

  return (
    // <div className={`ag-theme-alpine ${styles.tableContainer}`}>
    <div className={styles.Window}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Available A2A Agents</h2>
        </div>
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.tableContainer} ${styles.customScrollbar}`}>
        <AgGridReact
          theme = {myTheme}
          ref={gridRef}
          rowData={agents.filter(a => a.type === "a2a_agent")}
          columnDefs={columns}
          domLayout="autoHeight"
          rowSelection="single"
          suppressMovableColumns={true}
        />
      </div>
    </div>
  );
}