' ===================================================================
' Pharmacy POS - Desktop Launcher (VBScript)
' Runs the project completely in the background without terminal popups
' ===================================================================
Option Explicit
Dim WshShell, fso, scriptDir, projectDir, psCmd, exitCode

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Dynamically detect project root folder
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
projectDir = fso.GetParentFolderName(scriptDir)

If Not fso.FileExists(projectDir & "\package.json") Then
    projectDir = "D:\pharmacy-pos"
End If

If Not fso.FolderExists(projectDir) Then
    MsgBox "Pharmacy POS folder not found at:" & vbCrLf & projectDir, vbCritical, "Pharmacy POS - Missing Folder"
    WScript.Quit 1
End If

' Set working directory to project root
WshShell.CurrentDirectory = projectDir

' Run launch script silently
psCmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & projectDir & "\scripts\launch.ps1"""
exitCode = WshShell.Run(psCmd, 0, True)

WScript.Quit exitCode
