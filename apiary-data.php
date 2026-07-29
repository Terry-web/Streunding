<?php
header('Content-Type: application/json; charset=utf-8');
// Prevent aggressive browser caching
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

function loadEnvFile(string $path): void {
    if (!is_file($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);
        $value = trim($value, "\"'");

        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
        }

        putenv("{$key}={$value}");
    }
}

loadEnvFile(__DIR__ . '/.env');

try {
    $databaseUrl = getenv('DATABASE_URL') ?: getenv('SUPABASE_URL');
    $pdo = null;

    if ($databaseUrl) {
        $pdo = new PDO($databaseUrl, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } else {
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT') ?: '5432';
        $name = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $password = getenv('DB_PASSWORD');

        if (!$host || !$name || !$user) {
            throw new RuntimeException('Geen databaseconfiguratie gevonden.');
        }

        $dsn = "pgsql:host=$host;port=$port;dbname=$name";
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    $stmt = $pdo->query(
        "SELECT name, city, type, has_power, has_water, stand_fee, notes " .
        "FROM locations ORDER BY city, name"
    );

    $rows = $stmt->fetchAll();

    echo json_encode([
        'status' => 'ok',
        'data' => $rows,
        'appUrl' => getenv('APP_URL') ?: getenv('APP_URL_LIVE') ?: '',
        'source' => 'database',
    ]);
    exit;
} catch (Throwable $e) {
    $fallbackFile = __DIR__ . '/data/apiary-locations.json';
    if (is_file($fallbackFile)) {
        $rows = json_decode(file_get_contents($fallbackFile), true);
        if (is_array($rows)) {
            echo json_encode([
                'status' => 'ok',
                'data' => $rows,
                'appUrl' => getenv('APP_URL') ?: getenv('APP_URL_LIVE') ?: '',
                'source' => 'json-fallback',
                'message' => 'Geen connectie met de database beschikbaar.',
            ]);
            exit;
        }
    }

    echo json_encode([
        'status' => 'ok',
        'data' => [],
        'message' => 'Geen connectie met de database beschikbaar.',
        'source' => 'fallback-empty',
    ]);
}
