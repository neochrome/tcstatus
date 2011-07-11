@echo off
echo Running JSLint
tools\jsl.exe conf tools\jsl.default.conf -nologo -nofilelisting +recurse -process src\*.js -process specs\*.js
echo.
echo Verifying specifications
node tools/jasmine-node/cli.js --color specs
