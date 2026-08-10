<?php

return [
	'keys'  => explode(',', env('GROQ_API_KEYS')),
	'model' => 'openai/gpt-oss-20b',
];
