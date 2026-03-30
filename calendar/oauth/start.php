<?php
require_once __DIR__ . '/google_client.php';

$client = build_google_client();
$authUrl = $client->createAuthUrl();

header('Location: ' . $authUrl);
exit;