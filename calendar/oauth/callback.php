<?php
http_response_code(410);
header('Content-Type: text/plain; charset=utf-8');

echo "OAuth callback je vypnutý. Google OAuth credential je spravován přes environment variable GOOGLE_REFRESH_TOKEN.\n";
