<?php
// /calendar/oauth/google_client.php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config.php';

function build_google_client() {
  $client = new Google_Client();
  $client->setClientId(GOOGLE_CLIENT_ID);
  $client->setClientSecret(GOOGLE_CLIENT_SECRET);

  // Redirect URI musí přesně sedět s tím, co máš v Google Cloud Console:
  $client->setRedirectUri(base_url() . '/oauth/callback.php');

  $client->setScopes(array(Google_Service_Calendar::CALENDAR_READONLY));
  $client->setAccessType('offline');   // refresh_token
  $client->setPrompt('consent');       // vynutí refresh_token při první autorizaci

  return $client;
}

function load_token() {
  if (!file_exists(TOKEN_PATH)) return null;
  $raw = file_get_contents(TOKEN_PATH);
  if ($raw === false) return null;
  $tok = json_decode($raw, true);
  return is_array($tok) ? $tok : null;
}

function save_token($token) {
  $dir = dirname(TOKEN_PATH);
  if (!is_dir($dir)) mkdir($dir, 0700, true);
  file_put_contents(TOKEN_PATH, json_encode($token, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function get_authed_client_or_throw() {
  $client = build_google_client();
  $token = load_token();

  if (!$token) {
    throw new RuntimeException("Chybí OAuth token. Otevři /calendar/oauth/start.php a autorizuj.");
  }

  $client->setAccessToken($token);

  if ($client->isAccessTokenExpired()) {
    $refreshToken = $client->getRefreshToken();
    if (!$refreshToken && isset($token['refresh_token'])) $refreshToken = $token['refresh_token'];

    if (!$refreshToken) {
      throw new RuntimeException("Token expiroval a chybí refresh_token. Spusť znovu /calendar/oauth/start.php.");
    }

    $newToken = $client->fetchAccessTokenWithRefreshToken($refreshToken);

    if (isset($newToken['error'])) {
      $msg = isset($newToken['error_description']) ? $newToken['error_description'] : $newToken['error'];
      throw new RuntimeException("Refresh token chyba: " . $msg);
    }

    if (!isset($newToken['refresh_token'])) $newToken['refresh_token'] = $refreshToken;

    save_token($newToken);
    $client->setAccessToken($newToken);
  }

  return $client;
}