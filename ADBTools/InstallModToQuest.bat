@echo off
setlocal

if "%~1"=="" (
    echo Usage: InstallModToQuest.bat ^<export-folder^> ^<mod-id^>
    exit /b 1
)

if "%~2"=="" (
    echo Usage: InstallModToQuest.bat ^<export-folder^> ^<mod-id^>
    exit /b 1
)

set "SOURCE=%~1"
set "MODID=%~2"
set "REMOTE_ROOT=/sdcard/Android/data/com.Cydream.VoxelPlayground/files/Mods"

if not exist "%SOURCE%\manifest.json" (
    echo Export folder is missing manifest.json: %SOURCE%
    exit /b 1
)

echo Installing %MODID% from %SOURCE%

.\adb.exe shell rm -rf %REMOTE_ROOT%/%MODID%
if errorlevel 1 exit /b %errorlevel%

.\adb.exe shell mkdir -p %REMOTE_ROOT%
if errorlevel 1 exit /b %errorlevel%

.\adb.exe shell mkdir -p %REMOTE_ROOT%/%MODID%
if errorlevel 1 exit /b %errorlevel%

.\adb.exe shell mkdir -p %REMOTE_ROOT%/%MODID%/data %REMOTE_ROOT%/%MODID%/icons %REMOTE_ROOT%/%MODID%/prefabs %REMOTE_ROOT%/%MODID%/rendering %REMOTE_ROOT%/%MODID%/script
if errorlevel 1 exit /b %errorlevel%

.\adb.exe push "%SOURCE%" %REMOTE_ROOT%/
if errorlevel 1 exit /b %errorlevel%

exit /b 0
