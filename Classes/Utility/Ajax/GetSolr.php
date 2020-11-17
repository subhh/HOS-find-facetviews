<?php
/* * *************************************************************
 *  Copyright notice
 *
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
use TYPO3\CMS\Frontend\Utility\EidUtility;

/**
 * @return array
 */
function getOptionsFromTS() {
  /** @var TypoScriptFrontendController  $tsfc */
  $tsfc = GeneralUtility::makeInstance(
              'TYPO3\\CMS\\Frontend\\Controller\\TypoScriptFrontendController',
              $GLOBALS['TYPO3_CONF_VARS'],
              GeneralUtility::_GET('id') ? : 1,
              0,
              true
  );
  $GLOBALS['TSFE'] = $tsfc;
  $tsfc->fe_user = EidUtility::initFeUser();
  $tsfc->determineId();
  //$tsfc->getCompressedTCarray();
  $tsfc->initTemplate();
  $tsfc->getConfigArray();
  
  /** @var TypoScriptService $typoScriptService */
  $typoScriptService = GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Service\\TypoScriptService');
  try {
    $typoscriptArray = $tsfc->tmpl->setup['plugin.']['tx_find.']['settings.']['connections.']['default.']['options.'];
    $token = $typoScriptService->convertTypoScriptArrayToPlainArray($typoscriptArray);
    return $token; 
  } catch (Exception $e) {
    error_log("Missing TS parameter `plugin.tx_find.settings.connections.options`");
    return [];
  }
}

$opts = getOptionsFromTS();
$action= 'select';
$ACTIONS = ['select','suggest','query','browse','spell','tvrh','elevate','terms'];


$params = 'q=*:*';
foreach ($ACTIONS as $action) {
    $params = GeneralUtility::_GET($action);
    if ($params) {
      $url = $opts['scheme']. '://'.$opts['host'] .':' .$opts['port'] . $opts['path'] . '/'
        . $action . '?'. urldecode($params);
      header('Content-type: application/json');
//      echo $url;
      system('wget -qO- \''. $url.'\'');
    }
}
