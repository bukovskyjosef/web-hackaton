<?php
require_once __DIR__ . '/google_client.php';

if (!isset($_GET['code'])) {
  http_response_code(400);
  echo "Chybí code.";
  exit;
}

$client = build_google_client();
$token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

if (isset($token['error'])) {
  http_response_code(500);
  echo "OAuth chyba: " . (isset($token['error_description']) ? $token['error_description'] : $token['error']);
  exit;
}

save_token($token);

echo "OK: token uložen.<br><br>";
echo "Otevři <a href=\"" . htmlspecialchars(base_url() . "/index.html") . "\">/calendar</a>";