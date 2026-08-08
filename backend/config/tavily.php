<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Tavily API Key
    |--------------------------------------------------------------------------
    |
    | Here you may specify your Tavily API Key. This will be used to authenticate
    | with the Tavily Search API. You can specify multiple comma-separated keys
    | for key rotation.
    */

    'api_keys' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('TAVILY_API_KEY', ''))
    ))),

    /*
    |--------------------------------------------------------------------------
    | Tavily Base URL
    |--------------------------------------------------------------------------
    |
    | If you need a specific base URL for the Tavily API, you can provide it here.
    | Otherwise, leave empty to use the default value.
    */

    'base_url' => env('TAVILY_BASE_URL', 'https://api.tavily.com'),

    /*
    |--------------------------------------------------------------------------
    | Max Results
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default maximum number of search results to return.
    */

    'max_results' => env('TAVILY_MAX_RESULTS', 5),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout
    |--------------------------------------------------------------------------
    |
    | The timeout may be used to specify the maximum number of seconds to wait
    | for a response. By default, the client will time out after 15 seconds.
    */

    'request_timeout' => env('TAVILY_REQUEST_TIMEOUT', 15),
];
