<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo nao permitido.']);
    exit;
}

$configPath = dirname(__DIR__) . '/gemini-config.php';
if (is_file($configPath)) {
    require $configPath;
}

$apiKey = getenv('GEMINI_API_KEY') ?: (defined('GEMINI_API_KEY') ? GEMINI_API_KEY : '');
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'A chave Gemini ainda nao foi configurada no servidor.']);
    exit;
}

$rawBody = file_get_contents('php://input') ?: '';
$payload = json_decode($rawBody, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload invalido.']);
    exit;
}

$scenario = preg_replace('/[^a-z_]/', '', (string)($payload['scenario'] ?? 'atendimento'));
$message = trim((string)($payload['message'] ?? ''));
$history = is_array($payload['history'] ?? null) ? $payload['history'] : [];

if ($message === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Mensagem vazia.']);
    exit;
}

$prompts = [
    'cobranca' => 'Voce e o Assistente DDM em uma demonstracao comercial de agente de cobranca com IA. Conduza uma conversa educada, objetiva e consultiva sobre negociacao, acordos e recuperacao de credito. Nao solicite CPF, numero de contrato, cartao, senha, dados bancarios ou dados sensiveis. Explique capacidades do DDM Call IA quando fizer sentido. Se o usuario quiser um caso real, direcione para falar com especialista.',
    'qualificacao' => 'Voce e o Assistente DDM em uma demonstracao comercial de qualificacao de leads. Faca perguntas curtas para entender empresa, segmento, volume de contatos, canais atuais, urgencia e objetivo. Sugira produtos DDM adequados: DDM Call IA, Call IA WhatsApp, Omni CRM, Mail IA, QualiDDM, Dashboard Creator, Creator e Extrator de Leads. Nao invente precos ou promessas contratuais.',
    'atendimento' => 'Voce e o Assistente DDM em uma demonstracao comercial de atendimento com IA. Explique produtos e casos de uso do ecossistema DDM de forma clara, profissional e objetiva. Ajude o visitante a entender qual solucao faz sentido para atendimento, voz, chat, automacao, qualidade, dados e operacao.',
];

$systemInstruction = ($prompts[$scenario] ?? $prompts['atendimento'])
    . ' Responda sempre em portugues do Brasil, com no maximo 900 caracteres, tom premium, humano e comercial. Seja direto. Nunca diga que e Gemini, Google ou modelo de linguagem.';

$contents = [];
foreach (array_slice($history, -8) as $item) {
    if (!is_array($item)) {
        continue;
    }

    $role = ($item['role'] ?? '') === 'model' ? 'model' : 'user';
    $text = trim((string)($item['text'] ?? ''));
    if ($text === '') {
        continue;
    }

    $contents[] = [
        'role' => $role,
        'parts' => [['text' => substr($text, 0, 1200)]],
    ];
}

$contents[] = [
    'role' => 'user',
    'parts' => [['text' => substr($message, 0, 1200)]],
];

$requestBody = [
    'system_instruction' => [
        'parts' => [['text' => $systemInstruction]],
    ],
    'contents' => $contents,
    'generationConfig' => [
        'temperature' => 0.55,
        'topP' => 0.9,
        'maxOutputTokens' => 320,
    ],
];

$endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-goog-api-key: ' . $apiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($requestBody),
    CURLOPT_TIMEOUT => 25,
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($response === false || $curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'Nao foi possivel conectar ao assistente agora.']);
    exit;
}

$data = json_decode($response, true);
$text = trim((string)($data['candidates'][0]['content']['parts'][0]['text'] ?? ''));

if ($status >= 400 || $text === '') {
    http_response_code(502);
    echo json_encode(['error' => 'O assistente nao conseguiu responder agora.']);
    exit;
}

echo json_encode(['reply' => $text], JSON_UNESCAPED_UNICODE);
