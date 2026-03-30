<?php
// /calendar/api/events.php

require_once __DIR__ . '/../oauth/google_client.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

if (($_GET['token'] ?? '') !== API_SHARED_TOKEN) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Forbidden'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fold_txt($s) {
  $s = (string)($s ?? '');
  $s = mb_strtolower($s, 'UTF-8');
  $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
  return $t !== false ? $t : $s;
}

try {
  $needle = $_GET['needle'] ?? DEFAULT_NEEDLE;

  // Rozsah: +- 180 dní (můžeš upravit)
  $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
  $timeMin = $_GET['timeMin'] ?? $now->modify('-1 days')->format(DateTimeInterface::ATOM);
  $timeMax = $_GET['timeMax'] ?? $now->modify('+180 days')->format(DateTimeInterface::ATOM);

  $client = get_authed_client_or_throw();
  $svc = new Google_Service_Calendar($client);

  $events = [];
  $pageToken = null;

  do {
    $opt = [
      'singleEvents' => true,
      'orderBy'      => 'startTime',
      'timeMin'      => $timeMin,
      'timeMax'      => $timeMax,
      'maxResults'   => 2500,
    ];
    if ($pageToken) $opt['pageToken'] = $pageToken;

    $res = $svc->events->listEvents(CALENDAR_ID, $opt);

    foreach ($res->getItems() as $ev) {
      if ($ev->getStatus() === 'cancelled') continue;

      $summary = $ev->getSummary() ?? '';
      if (strpos(fold_txt($summary), fold_txt($needle)) === false) continue;

      $startObj = $ev->getStart();
      $endObj   = $ev->getEnd();
      $start = ($startObj && $startObj->getDateTime()) ? $startObj->getDateTime() : ($startObj ? $startObj->getDate() : '');
      $end   = ($endObj && $endObj->getDateTime())     ? $endObj->getDateTime()   : ($endObj ? $endObj->getDate() : '');

      $attendees = [];
      $att = $ev->getAttendees();
      if (is_array($att)) {
        foreach ($att as $a) {
          $attendees[] = [
            'email'  => $a->getEmail() ?? '',
            'name'   => $a->getDisplayName() ?? '',
            'status' => $a->getResponseStatus() ?? '',
            'optional' => (bool)$a->getOptional(),
            'comment'  => $a->getComment() ?? '',
          ];
        }
      }

      $events[] = [
        'event_id'   => $ev->getId() ?? '',
        'summary'    => $summary,
        'start'      => $start,
        'end'        => $end,
        'event_link' => $ev->getHtmlLink() ?? '',
        'attendees'  => $attendees,
      ];
    }

    $pageToken = $res->getNextPageToken();
  } while ($pageToken);

  echo json_encode([
    'ok' => true,
    'calendarId' => CALENDAR_ID,
    'timeMin' => $timeMin,
    'timeMax' => $timeMax,
    'needle' => $needle,
    'events' => $events,
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}