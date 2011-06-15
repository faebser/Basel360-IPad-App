<?
include("inc/config.inc.php");

$poi_id = mysql_real_escape_string($_GET[poi_id]);
$title = mysql_real_escape_string($_GET[title]);
$text = mysql_real_escape_string($_GET[text]);
$type = mysql_real_escape_string($_GET[type]);
$nonce = mysql_real_escape_string($_GET[nonce]);
$user = 0; //public user

//check if all arguments are passed:
If (!isset($poi_id) OR empty($poi_id) OR !isset($title) OR empty($title) OR !isset($text) OR empty($text) OR !isset($type) OR empty($type) OR !isset($nonce) OR empty($nonce)) {
	$xml .= missing_argument_response();
	output_handler($xml);
	exit;
}

//check if poi exists:
$sql = "SELECT poi.id FROM poi WHERE poi.id = '". $poi_id ."'";
$result = mysql_query($sql) or die(mysql_error());
$number_of_existing_pois = mysql_num_rows($result);

if ($number_of_existing_pois == 1) {

	$sql = 'INSERT INTO content_master (fk_poi_id, fk_user_id) VALUES ("'. $poi_id .'", "'. $user .'")';
	if ($result = @mysql_query($sql)) {
		$content_id = mysql_insert_id();
	}
	
	$sql = 'INSERT INTO main_content (fk_content_id, title, note, fk_type_id) VALUES ("'. $content_id .'", "'. $title .'", "'. $text .'", "'. $type .'")';
	if ($result = @mysql_query($sql)) {
		$xml .= '<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<response status="ok">';
		$xml .= '<content id="'. $content_id .'" />';
		$xml .= '</response>';
	}
}
output_handler($xml);
mysql_close()
?>