<?php

namespace Subhh\Hosfindfacetviews\Utility\Ajax;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;

$og = GeneralUtility::makeInstance('Subhh\Hosfindfacetviews\Utility\OpenGraph\OpenGraph');
$og->main();
 
class GetOpenGraph {
       function main(){
             $graph = $og::fetch(GeneralUtility::_GET('site'));
             return json_encode($graph);
       }
 }
?>