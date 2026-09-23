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

function get_authed_client_or_throw() {
  $client = build_google_client();

  $token = $client->fetchAccessTokenWithRefreshToken(GOOGLE_REFRESH_TOKEN);

  if (!is_array($token)) {
    throw new RuntimeException("Google OAuth vrátil neplatnou odpověď při obnově access tokenu.");
  }

  if (isset($token['error'])) {
    $message = $token['error_description'] ?? $token['error'];
    throw new RuntimeException("Refresh token chyba: " . (is_string($message) ? $message : 'neznámá chyba'));
  }

  if (!isset($token['access_token']) || !is_string($token['access_token']) || $token['access_token'] === '') {
    throw new RuntimeException("Google OAuth odpověď neobsahuje access token.");
  }

  $client->setAccessToken($token);

  return $client;
}
