<?
include("inc/config.inc.php");

// Get poi Information:
$sql = "SELECT poi.id, main_content.title, type.type, point.lng, point.lat
		FROM poi JOIN point_master JOIN point JOIN content_master JOIN main_content JOIN type
		WHERE poi.id = point_master.fk_poi_id && point_master.fk_point_id = point.id && poi.id = content_master.fk_poi_id && content_master.id = main_content.fk_content_id && main_content.fk_type_id = type.id";
$result = mysql_query($sql) or die(mysql_error());

$xml .= '<?xml version="1.0" encoding="utf-8"?>';
$xml .= '<response status="ok">';

while ($row = mysql_fetch_assoc($result)) {
	$xml .= '<poi id="'. $row[id] .'">';
		$xml .= '<title>'. $row[title] .'</title>';
		$xml .= '<type>'. $row[type] .'</type>';
		//$xml .= '<likes>'. $row[likes] .'</likes>';
		$xml .= '<lat>'. $row[lat] .'</lat>';
		$xml .= '<lng>'. $row[lng] .'</lng>';
	$xml .= '</poi>';
}
$xml .= '</response>';

output_handler($xml);
mysql_close();
?>