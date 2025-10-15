import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./ListLocalAgents.module.css";
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';  
import { myTheme } from "./AgGridTheme";  

// ModuleRegistry.registerModules([ AllCommunityModule ])

export default function ListLocalAgents({ agents, onDeleteLocalAgent, onEditLocalAgent }) {
    const gridRef = useRef();

    const columns = useMemo(() => [
        { headerName: "Local Agent Name", field: "name", sortable: true, filter: true },
        { headerName: "System Instructions", field: "instructions", flex: 1, wrapText: true, autoHeight: true, resizable: true },
        { headerName: "Description", field: "description", flex: 1, wrapText: true, autoHeight: true, resizable: true },
        {
        headerName: "Configure",
        field: "edit",
        cellRenderer: (params) => (
            <button
            className={styles.editBtn}
            onClick={() => onEditLocalAgent(params.data)}
            >
                <svg fill="#aaaaaaff" width='24px' height='24px' viewBox="-2 2 28 28" version="1.1" stroke="#aaaaaaff" strokeWidth="0.288">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <title>edit</title> 
                        <path d="M17.438 22.469v-4.031l2.5-2.5v7.344c0 1.469-1.219 2.688-2.656 2.688h-14.625c-1.469 0-2.656-1.219-2.656-2.688v-14.594c0-1.469 1.188-2.688 2.656-2.688h14.844v0.031l-2.5 2.469h-11.5c-0.531 0-1 0.469-1 1.031v12.938c0 0.563 0.469 1 1 1h12.938c0.531 0 1-0.438 1-1zM19.813 7.219l2.656 2.656 1.219-1.219-2.656-2.656zM10.469 16.594l2.625 2.656 8.469-8.469-2.625-2.656zM8.594 21.094l3.625-0.969-2.656-2.656z"></path> 
                    </g>
                </svg>
            </button>
        ),
        width: 100,
        pinned: "right"
        },
        {
        headerName: "Delete",
        field: "delete",
        cellRenderer: (params) => (
            <button
            className={styles.deleteBtn}
            onClick={() => onDeleteLocalAgent(params.data)}
            >
                <svg fill="#aaaaaaff" height="32" width="32" viewBox="-5 -5 32 32" stroke="#aaaaaaff" strokeWidth="0.00024000000000000003">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z">
                        </path>
                    </g>
                </svg>
            </button>
        ),
        width: 120,
        pinned: "right"
        }
    ], [onDeleteLocalAgent, onEditLocalAgent]);

    return (
        <div className={styles.Window}>
            <div className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Available Local Agents</h2>
                </div>
            </div>
            <div className={styles.separator}></div>
            <div className={`${styles.tableContainer} ${styles.customScrollbar}`}>
                <AgGridReact
                    theme = {myTheme}
                    ref={gridRef}
                    rowData={agents.filter(o => o.type === "local_agent")}
                    columnDefs={columns}
                    domLayout="autoHeight"
                    rowSelection="single"
                    suppressMovableColumns={true}
                />
            </div>
        </div>
    );
    }