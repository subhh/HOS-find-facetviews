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
 * ************************************************************* */
use Solarium\Client;
use Solarium\Exception\HttpException;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;
use Solarium\QueryType\Select\Query\Query as Select;


function getSettingsFromTS() {
  /** @var TypoScriptFrontendController  $tsfc */
  $tsfc = GeneralUtility::makeInstance(
              'TYPO3\\CMS\\Frontend\\Controller\\TypoScriptFrontendController',
              $GLOBALS['TYPO3_CONF_VARS'],
              GeneralUtility::_GET('pid') ?: 1,
              0,
              true
  );
  $tsfc->fe_user = EidUtility::initFeUser();
  $tsfc->determineId();
  $tsfc->initTemplate();
  $tsfc->getConfigArray();
  /** @var TypoScriptService $typoScriptService */
  $typoScriptService = GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Service\\TypoScriptService');
  return $typoScriptService->convertTypoScriptArrayToPlainArray($tsfc->tmpl->setup['plugin.']['tx_find.']['settings.']);

}

function getConnectionSettings($settings) {
  return [
      'endpoint' => [
          'localhost' => [
              'host' => $settings['host'],
              'port' => intval($settings['port']),
              'path' => $settings['path'],
              'timeout' => $settings['timeout'],
              'scheme' => $settings['scheme']
          ]
      ]
  ];
}

function LLL($file,$path) {
  GeneralUtility::readLLXMLfile($xmlPath, 'default');
}

// getting document id:
$documentId = GeneralUtility::_GP('document');

//$settings = getSettingsFromTS()['connections']['default']['options'];
//print_r($settings);
//exit;
$connectionSettings = getConnectionSettings(getSettingsFromTS()['connections']['default']['options']);

$solrClient = GeneralUtility::makeInstance(Solarium\Client::class,$connectionSettings);
$query= $solrClient->createSelect();
$query->setQuery('id:'.$documentId);
$query->setStart(0)->setRows(1);
$resultset = $solrClient->execute($query);

header('Content-type: application/json');
$results = array();
foreach ($resultset as $document) {
    $result = new stdClass();
    foreach ($document as $field => $value) {
        // this converts multivalue fields to a comma-separated string
        if (is_array($value)) {
            $elems = array();
            $value = implode(', ', $value);
        }
        if ($field == 'language') {
          
          $result->{$field} = $value;
        } else
        $result->{$field} = $value;
    }
    array_push($results,$result);  
}
echo json_encode($results[0]);


