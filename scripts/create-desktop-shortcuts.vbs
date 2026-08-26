' ===================================================================
' Pharmacy POS - Shortcut Setup (Double-click to create Desktop shortcuts)
' ===================================================================
Option Explicit
Dim WshShell, fso, scriptDir, projectDir, psCmd, exitCode

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
projectDir = fso.GetParentFolderName(scriptDir)

If Not fso.FileExists(projectDir & "\package.json") Then
    projectDir = "D:\pharmacy-pos"
End If

WshShell.CurrentDirectory = projectDir

psCmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & projectDir & "\scripts\create-desktop-shortcuts.ps1"""
exitCode = WshShell.Run(psCmd, 1, True)

If exitCode = 0 Then
    MsgBox "Desktop shortcuts created successfully!" & vbCrLf & vbCrLf & "• Pharmacy POS" & vbCrLf & "• Pharmacy POS - Stop", vbInformation, "Pharmacy POS Setup"
Else
    MsgBox "Failed to create shortcuts. Error code: " & exitCode, vbCritical, "Pharmacy POS Setup"
End If

WScript.Quit exitCode
