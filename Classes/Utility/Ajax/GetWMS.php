<?php
/*
 *  (c) 2019 Rainer Schleevoigt <rainer.schleevoigt@sub.uni-hamburg.de>
 *      Hamburg State and University Library
 *
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 * ************************************************************* */
use TYPO3\CMS\Core\Utility\GeneralUtility;

const TTL = 24*3600*100;
$CACHEFOLDER = 'typo3temp/wmszwischenspeicher';
$endpoint = "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB";//GeneralUtility::_GP('endpoint');

$layers =  GeneralUtility::_GP('layers');
$srs =  GeneralUtility::_GP('srs');
$size =  GeneralUtility::_GP('retina')*256;
$bbox =  GeneralUtility::_GP('bbox');
$key = 'wms_'. $bbox;

$querystring= 'service=WMS&request=GetMap&styles=&version=1.3.0&transparent=true&format=image/png';
$querystring .= '&bbox='.$bbox.'&crs='.$srs.'&layers='.$layers .'&width='.$size .'&height='.$size;
$url= $endpoint . '?' . $querystring;

header('Content-type: image/png');

$context = stream_context_create([
    "http" => [
        "ignore_errors" => true
    ],
]);

$response = file_get_contents($url, false, $context);

preg_match('{HTTP\/\S*\s(\d{3})}', $http_response_header[0], $match);
$status = (int) $match[1];

if ($status >= 400) {
    error_log("Geodienst nicht erreichbar ( " . $url . " )", 0);
} else {
    echo $response;
}
exit;
