import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);


export const myTheme = themeQuartz.withParams({
    backgroundColor: '#ffffff5f',
    borderColor: '#e2e2e2ff',
    borderWidth: 1,
    foregroundColor: '#5f5f5f',
    headerTextColor: '#5f5f5f',
    headerBackgroundColor: 'white',
    oddRowBackgroundColor: '#ffffff5f',
    headerColumnResizeHandleColor: '#e2e2e2ff',
    fontFamily: 'Manrope',
    fontSize: 12,
    headerFontFamily: 'Manrope',
    headerFontWeight: 500,
    cellFontFamily: 'Manrope',
    rowHoverColor: 'white',
    spacing: 4,
    menuBackgroundColor: 'white',
});