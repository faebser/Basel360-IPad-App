<?
include("inc/config.inc.php");

$poi_id = mysql_real_escape_string($_GET[poi_id]);

if (!is_numeric($poi_id)) {
	$xml .= empty_response();
	output_handler($xml);
	exit;
}
	
// Get poi information:
$sql = "SELECT type.type, main_content.likes, main_content.title, main_content.note
		FROM poi JOIN content_master JOIN main_content JOIN type
		WHERE content_master.fk_poi_id = ". $poi_id ." && content_master.id = main_content.fk_content_id && main_content.fk_type_id = type.id";
$result = mysql_query($sql) or die(mysql_error());
$number_of_results = @mysql_num_rows($result);

if ($number_of_results > 0) {
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="ok">';

	$row = mysql_fetch_assoc($result);
	$xml .= '<poi id="'. $poi_id .'">';
		$xml .= '<title>'. $row[title] .'</title>';
		$xml .= '<type>'. $row[type] .'</type>';
		$xml .= '<likes>'. $row[likes] .'</likes>';
		$xml .= '<text>'. $row[note] .'</text>';
		$xml .= '<images>';
		
		// Get images:
		$sql = "SELECT file.fk_content_id
			FROM file JOIN content_master
			WHERE content_master.fk_poi_id = ". $poi_id ." && content_master.id = file.fk_content_id && file.category = 'image'";
		$result = mysql_query($sql) or die(mysql_error());
		
		while ($row = mysql_fetch_assoc($result)) {
			$xml .= '<img_url>'. $global_url .'images/medium/'. $row[fk_content_id] .'.jpg</img_url>';
		}
		
		$xml .= '</images>';
		$xml .= '<video>';
			$xml .= '<youtube></youtube>';
		$xml.= '</video>';
	$xml .= '</poi>';
	$xml .= '</response>';
}
else {
	$xml .= empty_response();
}

output_handler($xml);
mysql_close()
?>