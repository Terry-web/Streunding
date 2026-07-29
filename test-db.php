<?php
header('Content-Type: text/html; charset=utf-8');

function loadEnvFile(string $path): void {
    if (!is_file($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $key = trim($key);
        $value = trim(trim($value), "\"'");
        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
    }
}

loadEnvFile(__DIR__ . '/.env');

echo '<h1>Database test</h1>';
echo '<pre>';
echo 'PHP version: ' . PHP_VERSION . PHP_EOL;
echo 'PDO drivers: ' . implode(', ', PDO::getAvailableDrivers()) . PHP_EOL;
echo 'DB_HOST: ' . getenv('DB_HOST') . PHP_EOL;
echo 'DB_PORT: ' . getenv('DB_PORT') . PHP_EOL;
echo 'DB_NAME: ' . getenv('DB_NAME') . PHP_EOL;
echo 'DB_USER: ' . getenv('DB_USER') . PHP_EOL;

try {
    $dsn = 'pgsql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: '5432') . ';dbname=' . getenv('DB_NAME');
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASSWORD'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo 'Connection: OK' . PHP_EOL;
    $stmt = $pdo->query("SELECT current_database() AS db, current_user AS user");
    print_r($stmt->fetch());
} catch (Throwable $e) {
    echo 'Connection: FAILED' . PHP_EOL;
    echo $e->getMessage() . PHP_EOL;
}

echo '</pre>';
