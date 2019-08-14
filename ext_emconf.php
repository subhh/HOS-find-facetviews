<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Additional facetviews for typo3find',
    'description' => 'A frontend  extension realising the HOS Schaufenster.',
    'category' => 'plugin',
    'author' => 'Rainer Schleevoigt',
    'author_company' => 'Staats- und Universitaetsbibliothek Hamburg Carl von Ossietzky',
    'author_email' => 'rainer.schleevoigt@sub.uni-hamburg.de',
    'state' => 'stable',
    'clearCacheOnLoad' => true,
    'version' => '0.1.3',
    'constraints' => [
        'depends' => [
            'typo3' => '8.7.0-8.9.99',
            'find' => '^3.1.0',
            'php' => '5.5.0-7.2.99'
        ]
    ],
    'autoload' => [
        'psr-4' => [
            'SubHH\\Schaufenster\\' => 'Classes'
        ]
    ],
];
