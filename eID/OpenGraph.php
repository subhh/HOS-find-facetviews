<?php

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;

$og = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('OpenGraph');
$graph = $og::fetch(GeneralUtility::_GET('site'));	

return json_encode($graph);

?>