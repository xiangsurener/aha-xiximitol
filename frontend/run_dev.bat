@echo off
chcp 936 >nul
cd .
where npm >nul 2>&1        
if %errorlevel% neq 0 (    
    echo npm 未安装，正在尝试安装 Node.js... 
    powershell -Command "Start-Process 'https://nodejs.org/zh-cn/download/' -Verb RunAs"
    pause
    exit
)
if not exist node_modules (
    echo 正在安装依赖... 
    npm install
)
npm run dev 
pause      