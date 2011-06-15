<?php
function output_handler($xml) {
	$output_format = $_GET[output];
	if ($output_format == "json") {
		require_once("inc/xml2json/xml2json.php");
		$jsonContents = xml2json::transformXmlStringToJson($xml);
		if (isset($_GET['callback'])) {
			echo $_GET['callback'] . '(' . $jsonContents . ');';
		}
		else {
			echo $jsonContents;
		}
	}
	else {
		header("Content-type: text/xml");
		echo $xml;
	}
}

function empty_response() {
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="empty">';
	$xml .= '</response>';
	return $xml;
}

function missing_argument_response() {
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="missing argument">';
	$xml .= '</response>';
	return $xml;
}

?>