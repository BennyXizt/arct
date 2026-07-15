<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

header('Content-Type: application/json');

$env = parse_ini_file(__DIR__ . '/../../.env');

if ($env === false) {
    echo json_encode(['status' => 'error', 'error' => '.env not found']);
    exit;
}

$authUsername   = $env['SMTP_USERNAME'];
$authPassword   = $env['SMTP_PASSWORD'];
$authHost       = $env['SMTP_HOST'] ?? 'smtp.gmail.com';
$authPort       = $env['SMTP_PORT'] ?? 587;
$authSecure     = $env['SMTP_SECURE'] ?? 'tls';
$authCharset    = $env['SMTP_CHARSET'] ?? 'UTF-8';
$sendTo         = $env['SMTP_SEND_TO'];

$name       = $_POST['name']    ?? 'Test Name';
$from       = $_POST['email']   ?? $authUsername;
$subject    = $_POST['subject'] ?? 'Get in Touch - ' . $from;
$message    = $_POST['message'] ?? 'Test Message';

$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host       = $authHost;
$mail->SMTPAuth   = true;
$mail->Username   = $authUsername;
$mail->Password   = $authPassword;
$mail->SMTPSecure = $authSecure;
$mail->Port       = $authPort;
$mail->CharSet    = 'UTF-8'; 

if (filter_var($from, FILTER_VALIDATE_EMAIL)) {
    $mail->addReplyTo($from, $name);
}

$mail->setFrom($authUsername, $name);
$mail->addAddress($sendTo);

$mail->Subject = $subject;
$mail->Body    = $message;

try {
    $mail->send();
    echo json_encode(['status' => 'ok']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'error' => $mail->ErrorInfo]);
}