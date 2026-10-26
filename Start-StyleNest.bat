@echo off
title StyleNest Dev Server
echo ==============================================
echo Starting StyleNest E-Commerce Platform...
echo ==============================================
cd /d "C:\Users\UESR\.gemini\antigravity\scratch\stylenest"
start http://localhost:5173
call npm run dev -- --host --port 5173
pause
