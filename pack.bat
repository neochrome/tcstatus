@echo off
setlocal
set base=%~dp0
set chrome="%LocalAppData%\Google\Chrome\Application\chrome.exe"
echo Packing %base%tcstatus
echo %chrome%
%chrome% --pack-extension="%base%tcstatus" --pack-extension-key="%base%chrome.extensions.pem" --no-message-box
move "%base%tcstatus.crx" "%base%tcstatus.%1.crx"
