<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';

if (!isPost() || !verifyCsrf()) {
    redirect(APP_URL . '/admin/login.php');
}

logout();
redirect(APP_URL . '/admin/login.php');
