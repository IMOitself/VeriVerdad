<?php

declare(strict_types=1);

return [
    'api_keys' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('TAVILY_API_KEY', ''))
    ))),

    'base_url' => env('TAVILY_BASE_URL', 'https://api.tavily.com'),

    'max_results' => env('TAVILY_MAX_RESULTS', 3),

    'request_timeout' => env('TAVILY_REQUEST_TIMEOUT', 15),
];
