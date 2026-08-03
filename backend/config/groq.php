<?php

declare(strict_types=1);

return [
    'api_keys' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('GROQ_API_KEY', ''))
    ))),

    'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),

    'default_model' => env('GROQ_DEFAULT_MODEL', 'llama-3.3-70b-versatile'),

    'request_timeout' => env('GROQ_REQUEST_TIMEOUT', 30),
];
