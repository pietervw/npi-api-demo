#!/usr/bin/env pwsh
param(
  [ValidateSet('Fast', 'Standard', 'Full')]
  [string]$Mode = 'Standard'
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
Set-Location -LiteralPath (Join-Path $PSScriptRoot '..')

npm --prefix node ci
Get-ChildItem node -Filter '*.js' | ForEach-Object { node --check $_.FullName }

npm --prefix typescript ci
Get-ChildItem typescript -Filter '*.ts' | ForEach-Object { node --check $_.FullName }

python -m compileall -q python
dotnet restore csharp
dotnet build csharp --configuration Release --no-restore
