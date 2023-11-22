@echo off
echo.

set NodePackagesPath=D:\hr_system\HrFront // Front services

set Path=%NodePackagesPath%\node_modules\.bin;%PATH%

set Path=%NodeFrontPath%\node_modules\.bin;%PATH%

set NODE_PATH=%NodePackagesPath%\node_modules;%NODE_PATH%
set NODE_ENV=production

echo Environment variables are successfully added.
echo. 
echo. 
echo. 

cd /d "D:/hr_system/HrFront" 
ng serve --host 192.168.0.69
echo. 
echo.