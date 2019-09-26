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
    'version' => '0.1.4',
    'constraints' => [
        'depends' => [
            'find' => '^3.1.1',
            'php' => '7.0.99-7.2.99',
            'typo3' => '8.7.0-9.5.99'
        ]
    ],
    'autoload' => [
        'psr-4' => [
            'SubHH\\Schaufenster\\' => 'Classes'
        ]
    ],
];
