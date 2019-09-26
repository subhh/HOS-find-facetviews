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
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;
// http://members.orcid.org/api/tutorial/search-orcid-registry
function getOptionsFromTS() {
  /** @var TypoScriptFrontendController  $tsfc */
  $tsfc = GeneralUtility::makeInstance(
              'TYPO3\\CMS\\Frontend\\Controller\\TypoScriptFrontendController',
              $GLOBALS['TYPO3_CONF_VARS'],
              GeneralUtility::_GET('id') ?: 1,
              0,
              true
  );
  $tsfc->fe_user = EidUtility::initFeUser();
  $tsfc->determineId();
  $tsfc->initTemplate();
  $tsfc->getConfigArray();
  
  /** @var TypoScriptService $typoScriptService */
  $typoScriptService = GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Service\\TypoScriptService');
  try {
    $typoscriptArray = $tsfc->tmpl->setup['plugin.']['tx_discovery.']['settings.']['orcid.']['oauth.'];
    $token = $typoScriptService->convertTypoScriptArrayToPlainArray($typoscriptArray);
    return $token; 
  } catch (Exception $e) {
    error_log("Missing TS parameter `plugin.tx_discovery.settings.orcid.oauth.accesstoken`");
    return "";
  }
  return "";
}
$CACHEFOLDER = 'typo3temp/discovery/';
$FilenameOfJsonCache = $CACHEFOLDER . 'ORCIDCACHE';
$FilenameOfJavascriptCache = $CACHEFOLDER . 'ORCIDCACHE.js';
if (!file_exists($CACHEFOLDER)) {
    mkdir($CACHEFOLDER);
}
if (!file_exists($FilenameOfJsonCache)) {
    file_put_contents($FilenameOfJsonCache,"{}");
}
if (!file_exists($FilenameOfJavascriptCache)) {
    file_put_contents($FilenameOfJavascriptCache,"var OrcidCache={};");
}
$opts = [
    "http" => [
        "method" => "GET",
        "header" => "Accept: application/json\r\nAuthorization type: Bearer\r\nAccess token: ".getOptionsFromTS()['accesstoken'],
    ]
];
$action = GeneralUtility::_GET('action');
switch ($action) {
  case 'search':
    $vname = GeneralUtility::_GET('vname');
    $fname = GeneralUtility::_GET('fname');
    $url = 'https://pub.orcid.org/v2.1/search/?q=';
    $url .= urlencode('given-names:' . $vname .'');
    if  (isset($fname)) $url .= urlencode(' AND family-name: '. $fname);
  break;
  case 'person':
    $orcid = GeneralUtility::_GET('orcid');
    $url = 'https://pub.orcid.org/v2.1/'.$orcid.'/person';
  break;
  case 'activities':
    $orcid = GeneralUtility::_GET('orcid');
    $url = 'https://pub.orcid.org/v2.1/'.$orcid.'/activities';
  break;
  default:
    $orcid = GeneralUtility::_GET('orcid');
    $url = 'https://pub.orcid.org/v2.1/'.$orcid.'/'.$action;
  break;
}
$PaylodFromORCID_Server = file_get_contents($url, false, stream_context_create($opts));
// very long time waiting …………
header('Content-type: application/json');
// caching to JSON in Doc-root
if ($action=='search') {
  // create new list
  $orcidlist = [];
  $ORCIDsFromServer = json_decode($PaylodFromORCID_Server)->result;
  for ($i=0; $i<count($ORCIDsFromServer);$i++) {
    $orcidlist[$i] = '"' .$ORCIDsFromServer[$i]->{'orcid-identifier'}->path . '"';
  }
  $ORCID = json_decode(file_get_contents($FilenameOfJsonCache));
  if (!$ORCID) {
    error_log($FilenameOfJsonCache . " was corrupt");
    $ORCID = new stdClass();
  } 
  $orcids = '['. join(',',$orcidlist).']';
  $ORCID->{$vname . ' ' . $fname} = $orcids;
  file_put_contents($FilenameOfJsonCache,json_encode($ORCID));
  $js = 'var OrcidCache=' .json_encode($ORCID,JSON_PRETTY_PRINT). ';';
  //echo $js;
  file_put_contents($FilenameOfJavascriptCache,$js);
   echo $orcids;
}
else
echo $PaylodFromORCID_Server;