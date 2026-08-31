<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo nao permitido.']);
    exit;
}

function clean_text(string $value, int $limit = 1200): string
{
    $value = trim(strip_tags($value));
    $value = preg_replace('/[\r\n]+/', "\n", $value) ?? $value;
    return substr($value, 0, $limit);
}

$nome = clean_text((string)($_POST['nome'] ?? ''), 160);
$empresa = clean_text((string)($_POST['empresa'] ?? ''), 160);
$email = trim((string)($_POST['email'] ?? ''));
$telefone = clean_text((string)($_POST['telefone'] ?? ''), 80);
$segmento = clean_text((string)($_POST['segmento'] ?? ''), 160);
$mensagem = clean_text((string)($_POST['mensagem'] ?? ''), 2000);
$interesses = $_POST['interesse'] ?? [];

if (!is_array($interesses)) {
    $interesses = [$interesses];
}

$interesses = array_values(array_filter(array_map(
    fn($item) => clean_text((string)$item, 120),
    $interesses
)));

if ($nome === '' || $empresa === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Preencha nome, empresa e e-mail corporativo.']);
    exit;
}

$to = 'comercial@grupoddm.com.br';
$subject = 'Novo lead - Site Produtos DDM';
$submittedAt = date('d/m/Y H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Nao identificado';

$body = implode("\n", [
    'Novo contato recebido pelo site de produtos DDM.',
    '',
    'Nome: ' . $nome,
    'Empresa: ' . $empresa,
    'E-mail: ' . $email,
    'Telefone: ' . ($telefone ?: 'Nao informado'),
    'Segmento: ' . ($segmento ?: 'Nao informado'),
    'Interesse(s): ' . ($interesses ? implode(', ', $interesses) : 'Nao informado'),
    '',
    'Mensagem:',
    $mensagem ?: 'Nao informada',
    '',
    'Enviado em: ' . $submittedAt,
    'IP: ' . $ip,
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Site Produtos DDM <no-reply@products.grupoddm.ia.br>',
    'Reply-To: ' . $nome . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(502);
    echo json_encode(['error' => 'Nao foi possivel enviar agora. Tente pelo WhatsApp comercial.']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Mensagem enviada. Nosso time comercial entrara em contato.'], JSON_UNESCAPED_UNICODE);
