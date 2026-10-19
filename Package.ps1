param([Parameter(Mandatory=$true)][string]$Output,[string]$Transcription)
$ErrorActionPreference='Stop'
if(Test-Path -LiteralPath (Join-Path $Output 'Jago-Pulse')){throw 'Choose a fresh preview output directory.'}
& (Join-Path $PSScriptRoot 'Build.ps1')
$portable=Join-Path $Output 'Jago-Pulse'
New-Item -ItemType Directory -Force -Path $portable | Out-Null
foreach($file in @('Jago-Pulse.exe','Jago-Pulse.html','Microsoft.Web.WebView2.Core.dll','Microsoft.Web.WebView2.WinForms.dll','WebView2Loader.dll','README.md','LICENSE.txt')){Copy-Item -LiteralPath (Join-Path $PSScriptRoot $file) -Destination $portable}
foreach($folder in @('Brand','Documentation','Notices','Examples')){Copy-Item -LiteralPath (Join-Path $PSScriptRoot $folder) -Destination $portable -Recurse}
Compress-Archive -LiteralPath $portable -DestinationPath (Join-Path $Output 'Jago-Pulse-v0.11.3-Preview.zip')
if($Transcription){
 $optional=Join-Path $Output 'Optional transcription/Jago-Pulse/Transcription'
 New-Item -ItemType Directory -Force -Path $optional | Out-Null
 $expected=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'Dependencies/Transcription/manifest.json') -Raw | ConvertFrom-Json
 foreach($entry in $expected.files.PSObject.Properties){$inputFile=Join-Path $Transcription $entry.Name;if((Get-FileHash -LiteralPath $inputFile -Algorithm SHA256).Hash -ne $entry.Value){throw ('Different transcription dependency: '+$entry.Name)};Copy-Item -LiteralPath $inputFile -Destination $optional}
 Compress-Archive -LiteralPath (Join-Path $Output 'Optional transcription/Jago-Pulse') -DestinationPath (Join-Path $Output 'Jago-Pulse-Offline-Lyrics.zip')
}
$browser=Join-Path $Output 'Browser'
New-Item -ItemType Directory -Force -Path $browser | Out-Null
foreach($file in @('Jago-Pulse.html','README.md','LICENSE.txt')){Copy-Item -LiteralPath (Join-Path $PSScriptRoot $file) -Destination $browser}
foreach($folder in @('Documentation','Examples','Notices')){Copy-Item -LiteralPath (Join-Path $PSScriptRoot $folder) -Destination $browser -Recurse}
Compress-Archive -LiteralPath $browser -DestinationPath (Join-Path $Output 'Jago-Pulse-Browser-v0.11.3-Preview.zip')
& git -C $PSScriptRoot archive --format=zip ('--output='+(Join-Path $Output 'Jago-Pulse-Source-v0.11.3.zip')) HEAD
if($LASTEXITCODE -ne 0){throw 'Source archive failed'}
$manifest=[ordered]@{version='0.11.3';channel='development-preview';commit=(& git -C $PSScriptRoot rev-parse HEAD);files=@{}}
Get-ChildItem -LiteralPath $Output -File -Filter '*.zip' | ForEach-Object {$manifest.files[$_.Name]=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $Output 'Build-manifest.json') -Encoding UTF8
Write-Output ('Preview ready: '+$Output)
