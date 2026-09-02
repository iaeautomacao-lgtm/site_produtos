<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

$configPath = dirname(__DIR__) . '/gemini-config.php';
if (is_file($configPath)) {
    require $configPath;
}

$apiKey = getenv('GEMINI_API_KEY') ?: (defined('GEMINI_API_KEY') ? GEMINI_API_KEY : '');
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'A chave Gemini ainda não foi configurada no servidor.']);
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
    'cobranca' => 'Você é o Assistente DDM em uma demonstração comercial de agente de cobrança com IA. Conduza uma conversa educada, objetiva e consultiva sobre negociação, acordos e recuperação de crédito. Não solicite CPF, número de contrato, cartão, senha, dados bancários ou dados sensíveis. Explique capacidades do DDM Call IA quando fizer sentido. Se o usuário quiser um caso real, direcione para falar com especialista.',
    'qualificacao' => 'Você é o Assistente DDM em uma demonstração comercial de qualificação de leads. Faça perguntas curtas para entender empresa, segmento, volume de contatos, canais atuais, urgência e objetivo. Sugira produtos DDM adequados: DDM Call IA, Call IA WhatsApp, Omni CRM, Mail IA, QualiDDM, Dashboard Creator, Creator e Extrator de Leads. Não invente preços ou promessas contratuais.',
    'atendimento' => 'Você é o Assistente DDM em uma demonstração comercial de atendimento com IA. Explique produtos e casos de uso do ecossistema DDM de forma clara, profissional e objetiva. Ajude o visitante a entender qual solução faz sentido para atendimento, voz, chat, automação, qualidade, dados e operação.',
];

$systemInstruction = ($prompts[$scenario] ?? $prompts['atendimento'])
    . ' Responda sempre em português do Brasil, com no máximo 420 caracteres no total, divididos em 2 ou 3 parágrafos curtos separados por uma linha em branco. Cada parágrafo com no máximo duas frases. Tom premium, humano e comercial. Seja direto e nunca use listas ou markdown. Nunca diga que é Gemini, Google ou modelo de linguagem.';

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
        'maxOutputTokens' => 220,
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
    echo json_encode(['error' => 'Não foi possível conectar ao assistente agora.']);
    exit;
}

$data = json_decode($response, true);
$text = trim((string)($data['candidates'][0]['content']['parts'][0]['text'] ?? ''));

if ($status >= 400 || $text === '') {
    http_response_code(502);
    echo json_encode(['error' => 'O assistente não conseguiu responder agora.']);
    exit;
}

echo json_encode(['reply' => $text], JSON_UNESCAPED_UNICODE);
