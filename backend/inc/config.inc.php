<?php
//host and url:
$host = "geopedia.hyperwerk.ch";
$global_url = "http://". $host ."/";

//functions:
require_once("inc/functions.inc.php");

//DB connection:
$dp = @mysql_connect("localhost", "geopedia", "location") or die(db_connection_failure());
@mysql_select_db("geopedia", $dp) or die(db_connection_failure());
mysql_query("SET NAMES 'utf8'");

function db_connection_failure() {
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="no connection to database">';
	$xml .= '</response>';
	output_handler($xml);
	exit;
};

//Exit if host is not allow to access API:
$callingURL = $_SERVER['HTTP_HOST'];
if ($callingURL != $host) {
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="access denied">';
	$xml .= '</response>';
	output_handler($xml);
	exit;
}
?>