@echo off
setlocal enabledelayedexpansion

set "comment=/*\n  ✨ Coded with vibes by Rowhit (@rohiteeee)\n\n  🔗 GitHub:   github.com/Rohitsingh385\n  💼 LinkedIn: linkedin.com/in/rohiteeee\n  📧 Email:    rk301855@gmail.com\n\n  🧃 If you're using this, toss some credit — it's only fair.\n  🧠 Built from scratch, not snatched. Respect the grind.\n  \n*/\n\n"

for /r %%f in (*.js *.css) do (
    echo Processing: %%f
    
    rem Skip node_modules and package-lock.json
    echo %%f | findstr /i "node_modules package-lock.json" > nul
    if !errorlevel! neq 0 (
        rem Check if file already has the comment
        findstr /c:"✨ Coded with vibes by Rowhit" "%%f" > nul
        if !errorlevel! neq 0 (
            rem Create a temporary file
            set "tempfile=%%f.tmp"
            
            rem Write the comment to the temp file
            echo !comment:~0,-1! > "!tempfile!"
            
            rem Append the original file content
            type "%%f" >> "!tempfile!"
            
            rem Replace the original file with the temp file
            move /y "!tempfile!" "%%f" > nul
            
            echo Added comment to: %%f
        ) else (
            echo Comment already exists in: %%f
        )
    ) else (
        echo Skipping: %%f
    )
)

echo Done!