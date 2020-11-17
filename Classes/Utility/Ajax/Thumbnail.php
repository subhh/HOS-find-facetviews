<?php

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Utility\EidUtility;


$site = GeneralUtility::_GET('site');
	if ( !function_exists('apc_fetch') || !$image = apc_fetch( "thumbnail:".$site )) {
		$image = file_get_contents("https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=$site&screenshot=true");
		$image = json_decode($image, true); 
		$image = $image['screenshot']['data'];
		if (function_exists('apc_fetch'))
			apc_add("thumbnail:".$site, $image, 24*3600*90); 
	}
	$image = str_replace(array('_','-'),array('/','+'),$image); 
	echo "data:image/jpeg;base64,".$image;

