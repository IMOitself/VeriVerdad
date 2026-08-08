<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Groq API Key
    |--------------------------------------------------------------------------
    |
    | Here you may specify your Groq API Key. This will be used to authenticate
    | with the Groq API. You can specify multiple comma-separated keys for
    | key rotation.
    */

    'api_keys' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('GROQ_API_KEY', ''))
    ))),

    /*
    |--------------------------------------------------------------------------
    | Groq Base URL
    |--------------------------------------------------------------------------
    |
    | If you need a specific base URL for the Groq API, you can provide it here.
    | Otherwise, leave empty to use the default value.
    */

    'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),

    /*
    |--------------------------------------------------------------------------
    | Default Model
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default model to use for Groq API requests.
    */

    'default_model' => env('GROQ_DEFAULT_MODEL', 'llama-3.3-70b-versatile'),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout
    |--------------------------------------------------------------------------
    |
    | The timeout may be used to specify the maximum number of seconds to wait
    | for a response. By default, the client will time out after 30 seconds.
    */

    'request_timeout' => env('GROQ_REQUEST_TIMEOUT', 30),
];
