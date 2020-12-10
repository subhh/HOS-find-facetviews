<?php

use TYPO3\CMS\Core\Utility\GeneralUtility;

$requestBaseUrl = "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB";

$requestParams = array(
    'service' => 'WMS',
    'request' => 'GetMap',
    'styles' => '',
    'version' => '1.3.0',
    'transparent' => 'true',
    'format' => 'image/png',
    'layers' => GeneralUtility::_GP('layers'),
    'width'  => GeneralUtility::_GP('retina') * 256,
    'height' => GeneralUtility::_GP('retina') * 256,
    'crs'    => GeneralUtility::_GP('srs'),
    'bbox'   => GeneralUtility::_GP('bbox'),
);
$requestUrl = $requestBaseUrl . '?' . http_build_query($requestParams);

$cacheTtl = 24 * 3600; // 24h Cache
$cacheKey = base64_encode($requestUrl);

$response = apc_fetch($cacheKey);
if (!$response) {
    $context = stream_context_create(["http" => ["ignore_errors" => true]]);
    $response = file_get_contents($requestUrl, false, $context);

    preg_match('{HTTP\/\S*\s(\d{3})}', $http_response_header[0], $match);
    $status = (int) $match[1];
    if ($status >= 400 || !$response) {
        error_log("Geodienst nicht erreichbar Code: " . $status . " ( " . $requestUrl . " )", 0);
        http_response_code(502);
        exit();
    }

    if (ord($response[0]) !== 137) {
        error_log("Geodienst liefert keine PNG-Grafik ( " . $requestUrl . " )", 0);
        http_response_code(502);
        exit();
    }

    apc_add($cacheKey, $response, $cacheTtl);
}

header('Content-type: image/png');
echo $response;
