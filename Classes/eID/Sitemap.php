<?php
/* * *************************************************************
 *  Copyright notice
 *
 *  (c) 2018 Rainer Schleevoigt <rainer.schleevoigt@sub.uni-hamburg.de>
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
 * ************c************************************************* */
use Solarium\Client;
use Solarium\Exception\HttpException;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;
header('Content-type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";

function getOptionsFromTS() {
  /** @var TypoScriptFrontendController  $tsfc */
  $tsfc = GeneralUtility::makeInstance(
              'TYPO3\\CMS\\Frontend\\Controller\\TypoScriptFrontendController',
              $GLOBALS['TYPO3_CONF_VARS'],
              GeneralUtility::_GET('id') ?: 6,
              0,
              true
  );
  $tsfc->fe_user = EidUtility::initFeUser();
  $tsfc->determineId();
  $tsfc->initTemplate();
  $tsfc->getConfigArray();
  /** @var TypoScriptService $typoScriptService */
  $typoScriptService = GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Service\\TypoScriptService');
  return $typoScriptService->convertTypoScriptArrayToPlainArray($tsfc->tmpl->setup['plugin.']['tx_find.']['settings.']['connections.']['default.']['options.']);
}
function getConnectionSettings($options) {
  return [
      'endpoint' => [
          'localhost' => [
              'host' => $options['host'],
              'port' => intval($options['port']),
              'path' => $options['path'],
              'timeout' => $options['timeout'],
              'scheme' => $options['scheme']
          ]
      ]
  ];
}
$connectionSettings = getConnectionSettings(getOptionsFromTS());
$solrClient = GeneralUtility::makeInstance(Solarium\Client::class,$connectionSettings);
$query= $solrClient->createSelect();
$query->setFields(array('id'));
$query->setStart(0)->setRows(500000);
$resultset = $solrClient->execute($query);
$entries = [];

$slotname = GeneralUtility::_GP('sitemap');
echo (isset($slotname)) 
  ? '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' 
  : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';


foreach ($resultset as $document) {
    foreach ($document as $field => $value) {
        // first second letters of md5string:
        $slot = substr(md5($value),0,2); 
        if (!isset($slotname)) { // main sitemapindex
            if (!in_array($slot, $entries)) {
              array_push($entries, $slot);
            }
        } else { // subsitemap
            if ($slot == $slotname) {
               array_push($entries,$value);
            }
        }    
      }
}
foreach ($entries AS $entry) {
  echo (isset($slotname))
     ? "\n\t".'<url><loc>https://'. GeneralUtility::getHostname() . '/ID/' . $entry . '</loc></url>'
     : "\n\t".'<sitemap><loc>https://'. GeneralUtility::getHostname() . '/?eID=sitemap&amp;sitemap=' . $entry . '</loc></sitemap>';
} 

echo (isset($slotname)) 
  ? "\n</sitemapindex>" 
  : "\n</urlset>";