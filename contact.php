<?php
// Simple contact form handler. Upload to a PHP-enabled host (Strato supports PHP).
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = 'info@streunding.nl';
    $subject = isset($_POST['subject']) ? strip_tags($_POST['subject']) : 'Website bericht';
    $name = isset($_POST['name']) ? strip_tags($_POST['name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? strip_tags($_POST['phone']) : '';
    $location = isset($_POST['location']) ? strip_tags($_POST['location']) : '';
    $datetime = isset($_POST['datetime']) ? strip_tags($_POST['datetime']) : '';
    $message = isset($_POST['message']) ? strip_tags($_POST['message']) : '';

    $body = "Naam: $name\n";
    $body .= "Email: $email\n";
    if ($phone) $body .= "Telefoon: $phone\n";
    if ($location) $body .= "Locatie: $location\n";
    if ($datetime) $body .= "Datum/tijd: $datetime\n";
    $body .= "\nBericht:\n$message\n";

    $headers = "From: $name <$email>\r\n" .
               "Reply-To: $email\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Try sending email
    $ok = @mail($to, $subject, $body, $headers);

    if ($ok) {
        header('Location: thank-you.html');
        exit;
    } else {
        echo "<p>Er is een fout opgetreden bij verzenden. Probeer later opnieuw.</p>";
    }
}
?>
