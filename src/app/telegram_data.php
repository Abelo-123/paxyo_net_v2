<?php
// telegram_data.php - Receives and displays Telegram Web App data
// Configure session for iframe cross-site support
session_set_cookie_params([
    'lifetime' => 86400 * 365,
    'path' => '/',
    'domain' => 'paxyo.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

// Get Telegram data from URL parameters
$tg_id = isset($_GET['tg_id']) ? intval($_GET['tg_id']) : null;
$tg_first_name = isset($_GET['tg_first_name']) ? htmlspecialchars($_GET['tg_first_name']) : '';
$tg_last_name = isset($_GET['tg_last_name']) ? htmlspecialchars($_GET['tg_last_name']) : '';
$tg_username = isset($_GET['tg_username']) ? htmlspecialchars($_GET['tg_username']) : '';
$tg_language = isset($_GET['tg_language']) ? htmlspecialchars($_GET['tg_language']) : '';
$tg_is_premium = isset($_GET['tg_is_premium']) ? ($_GET['tg_is_premium'] === '1') : false;
$tg_init_data = isset($_GET['tg_init_data']) ? $_GET['tg_init_data'] : '';

// Store in session for use across pages
if ($tg_id) {
    $_SESSION['tg_id'] = $tg_id;
    $_SESSION['tg_first_name'] = $tg_first_name;
    $_SESSION['tg_last_name'] = $tg_last_name;
    $_SESSION['tg_username'] = $tg_username;
    $_SESSION['tg_language'] = $tg_language;
    $_SESSION['tg_is_premium'] = $tg_is_premium;
    $_SESSION['tg_init_data'] = $tg_init_data;
    
    // Set cookies for cross-page access
    $cookieOptions = [
        'expires' => time() + (20 * 365 * 24 * 60 * 60),
        'path' => '/',
        'domain' => 'paxyo.com',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None'
    ];
    
   
    setcookie("idd", $tg_id, $cookieOptions);
    setcookie("id", $tg_id, $cookieOptions);
    setcookie("in", "2", $cookieOptions);
    setcookie("username", $tg_first_name, $cookieOptions);
    setcookie("fromid", 111, $cookieOptions);

}
?>