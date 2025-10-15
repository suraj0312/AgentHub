@echo off
setlocal enabledelayedexpansion

REM Root folder where this script is located
SET "ROOT_DIR=%~dp0"

echo Starting AgentHub orchestrated startup sequence...

REM === Step 1: Start a2a_server (git_agent) ===
echo.
echo === Step 1: Start a2a_server (git_agent) ===
pushd "%ROOT_DIR%agents\a2a_agents\git_agent" || (
    echo Failed to change directory to agents\a2a_agents\git_agent
    pause
    exit /b 1
)

echo Running: uv sync
uv sync
IF %ERRORLEVEL% NEQ 0 (
    echo "uv sync" failed in git_agent (error %ERRORLEVEL%)
    REM Continue execution instead of exiting
) ELSE (
    echo Running: uv run a2a_server.py
    start "a2a_server" cmd /k "uv run a2a_server.py"
    timeout /t 2 /nobreak >nul
)
popd

REM === Step 2: Start AGUI server ===
echo.
echo === Step 2: Start AGUI server ===
pushd "%ROOT_DIR%agui_server" || (
    echo Failed to change directory to agui_server
    pause
    exit /b 1
)

echo Running: uv sync
uv sync
IF %ERRORLEVEL% NEQ 0 (
    echo "uv sync" failed in agui_server (error %ERRORLEVEL%)
) ELSE (
    echo Running: uv run server.py
    start "agui_server" cmd /k "echo Starting AGUI Server... && uv run server.py || echo Failed to start server.py"
    timeout /t 2 /nobreak >nul
)
popd

echo All start commands issued. Separate windows were opened for agent and server. Now you can start the agui client