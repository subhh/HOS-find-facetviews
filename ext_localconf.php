<?php
defined('TYPO3_MODE') || die('Access denied.');

$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['tile'] = 'EXT:'.$_EXTKEY . '/eID/GetTile.php';
$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['sitemap'] = 'EXT:'. $_EXTKEY.'/eID/Sitemap.php';
$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['orcid'] = 'EXT:'.$_EXTKEY.'/eID/Orcid.php';
$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['detail'] = 'EXT:'. $_EXTKEY.'/eID/Detail.php';
$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['wms'] = 'EXT:'. $_EXTKEY.'/eID/GetWMS.php';

$TYPO3_CONF_VARS['EXTCONF']['realurl'] =  array(
        '_DEFAULT' => array(
                'init' => array(
                        'enableCHashCache' => 1,
                        'appendMissingSlash' => 'ifNotFile',
                        'enableUrlDecodeCache' => 1,
                        'enableUrlEncodeCache' => 1,
                ),
                'fixedPostVars' => array(
                ),

                'postVarSets' => array(
                        '_DEFAULT' => array(
                                'ID' => array(
                                        array('GETvar' => 'tx_find_find[id]')
 	       	                 ),
 	       	                 'page' => array(
 	       	                         array()
 	       	                 ),

                ),
           ),
        ),
);
