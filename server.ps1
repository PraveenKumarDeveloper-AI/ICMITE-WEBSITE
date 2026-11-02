$port = 5500
$root = if ($PSScriptRoot) { $PSScriptRoot } else { $PWD.Path }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Output "Live Server running at http://localhost:$port/"
    Start-Process "http://localhost:$port/"
} catch {
    # If port 5500 is in use, try port 8080
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Output "Live Server running at http://localhost:$port/"
    Start-Process "http://localhost:$port/"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        $filePath = Join-Path $root $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html"  { "text/html; charset=utf-8" }
                ".css"   { "text/css; charset=utf-8" }
                ".js"    { "application/javascript; charset=utf-8" }
                ".png"   { "image/png" }
                ".jpg"   { "image/jpeg" }
                ".jpeg"  { "image/jpeg" }
                ".svg"   { "image/svg+xml" }
                ".pdf"   { "application/pdf" }
                ".json"  { "application/json" }
                ".webp"  { "image/webp" }
                ".ico"   { "image/x-icon" }
                ".woff"  { "font/woff" }
                ".woff2" { "font/woff2" }
                ".gif"   { "image/gif" }
                default  { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue handling requests
    }
}
