<?php
// /calendar/config.php

function env_required(string $name): string {
    $value = getenv($name);

    if ($value === false || $value === '') {
        throw new RuntimeException("Missing required environment variable: {$name}");
    }

    return $value;
}

// Hodnoty z Coolify Environment Variables
define('GOOGLE_CLIENT_ID', env_required('GOOGLE_CLIENT_ID'));
define('GOOGLE_CLIENT_SECRET', env_required('GOOGLE_CLIENT_SECRET'));
define('GOOGLE_REFRESH_TOKEN', env_required('GOOGLE_REFRESH_TOKEN'));
define('CALENDAR_ID', env_required('CALENDAR_ID'));
define('API_SHARED_TOKEN', env_required('API_SHARED_TOKEN'));

// Výchozí filtr
define('DEFAULT_NEEDLE', 'hackaton');

// Funguje i za Cloudflare / Coolify reverse proxy
function base_url(): string {
    $scheme = $_SERVER['HTTP_X_FORWARDED_PROTO']
        ?? ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');

    // Pro případ "https,http"
    $scheme = trim(explode(',', $scheme)[0]);

    $host = $_SERVER['HTTP_HOST'] ?? 'hackaton.cz';

    return $scheme . '://' . $host . '/calendar';
}
