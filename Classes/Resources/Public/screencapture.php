<?php
//screenCaptureFromURL.php
if(!empty($_POST['url'])){
    //website url
    $siteURL = $_POST['url'];
 
    if(filter_var($siteURL, FILTER_VALIDATE_URL)){
        //call Google PageSpeed Insights API
        $googlePagespeedData = file_get_contents("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=$siteURL&screenshot=true");
 
        //decode json data
        $googlePagespeedData = json_decode($googlePagespeedData, true);
 
        //screenshot data
        $screenshot = $googlePagespeedData['screenshot']['data'];
        $screenshot = str_replace(array('_','-'),array('/','+'),$screenshot);
 
        //display screenshot image
//        echo '<img src="data:image/jpeg;base64,"'.$screenshot . '" width=200 height=200 />';
           echo 'data:image/jpeg;base64,'.$screenshot;
    }else{
        echo "Please enter a valid URL.";
    }
} else echo "no url"
?>