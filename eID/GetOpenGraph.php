<?php

namespace Subhh\Hosfindfacetviews\Utility\OpenGraph;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;
use Vendor\Hosfindfacetviews\Utility\OpenGraph;

$og = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('Subhh\\Hosfindfacetviews\\Utility\\OpenGraph\\OpenGraphLib');
$graph = $og::fetch(GeneralUtility::_GET('site'));
return json_encode($graph);

?>