# Chiffre edusport-secrets.yaml avec kubeseal
# Le fichier plain reste local, seul le SealedSecret est commité

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path $PSScriptRoot -Parent
$SecretsPlain  = Join-Path $RepoRoot "charts\edusport-connect\secrets\edusport-secrets.yaml"
$SealedOut     = Join-Path $RepoRoot "charts\edusport-connect\templates\sealed-secret.yaml"
$Cert = if ($env:CERT) { $env:CERT } else {
  $pubCert = Join-Path $RepoRoot "pub-cert.pem"
  if (Test-Path $pubCert) { $pubCert } else { $pubCert }
}

if (-not (Test-Path $SecretsPlain)) {
  Write-Error "Fichier non trouvé: $SecretsPlain"
  exit 1
}
if (-not (Test-Path $Cert)) {
  Write-Error "Certificat non trouvé. Place pub-cert.pem à la racine du repo, ou définis `$env:CERT=chemin\vers\cert.pem"
  exit 1
}

Write-Host "Chiffrement de edusport-secrets..."
$tempOut = Join-Path $env:TEMP "edusport-sealed-$([Guid]::NewGuid().ToString('N').Substring(0,8)).yaml"
kubeseal --format yaml --cert $Cert --scope namespace-wide -f $SecretsPlain | Out-File -FilePath $tempOut -Encoding utf8
$sealed = Get-Content $tempOut -Raw
Remove-Item $tempOut -Force -ErrorAction SilentlyContinue
$sealed = $sealed -replace 'namespace: edusport-connect', 'namespace: {{ .Values.namespace }}'
$final = "---`n" + $sealed
[System.IO.File]::WriteAllText($SealedOut, $final, [System.Text.UTF8Encoding]::new($false))

Write-Host "sealed-secret.yaml mis à jour"
Write-Host "Fichier plain (ne pas committer): $SecretsPlain"
