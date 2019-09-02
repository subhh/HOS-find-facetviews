<?php
$needle = \TYPO3\CMS\Core\Utility\GeneralUtility::_GP('needle');
$url = 'http://words.bighugelabs.com/api/2/4831e32b4d2b828ca1ad0c070355c0b1/' . urlencode($needle) . '/json';
header('Content-type: application/json');
echo  file_get_contents($url);
