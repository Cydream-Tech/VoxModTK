Dir /B ..\Export\Android > name.txt

set /p a=<name.txt
echo %a%

.\adb.exe shell rm -r /sdcard/Android/data/com.Cydream.VoxelPlayground/files/Mods/%a%
.\adb.exe shell mkdir -p /sdcard/Android/data/com.Cydream.VoxelPlayground/files/Mods/%a%
.\adb.exe push ..\Export\Android\%a% /sdcard/Android/data/com.Cydream.VoxelPlayground/files/Mods/

Del name.txt