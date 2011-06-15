<?
include("inc/config.inc.php");
/*
$poi_title = mysql_real_escape_string($_GET[title]);
$poi_type = mysql_real_escape_string($_GET[type]);
$poi_user = 0; //public user
$lat = mysql_real_escape_string($_GET[lat]);
$lng = mysql_real_escape_string($_GET[lng]);
*/

$lat = mysql_real_escape_string($_GET[lat]);
$lng = mysql_real_escape_string($_GET[lng]);
$street = mysql_real_escape_string($_GET[street]);
$zip = mysql_real_escape_string($_GET[zip]);
$city = mysql_real_escape_string($_GET[city]);
$country = mysql_real_escape_string($_GET[country]);
$nonce = mysql_real_escape_string($_GET[nonce]);
$user = 0; //public user

//check if all arguments are passed:
If (!isset($lat) OR empty($lat) OR !isset($lng) OR empty($lng) OR !isset($street) OR empty($street) OR !isset($zip) OR empty($zip) OR !isset($city) OR empty($city) OR !isset($country) OR empty($country) && !isset($nonce) OR empty($nonce)) {
	$xml .= missing_argument_response();
	output_handler($xml);
	exit;
}

//check if address already exists:
$sql = "SELECT address_master.fk_poi_id
	FROM address JOIN address_master
	WHERE address.id = address_master.fk_address_id && address.zip = '". $zip ."' && address.street = '". $street ."'";
$result = mysql_query($sql) or die(mysql_error());
$number_of_existing_addresses = mysql_num_rows($result);
if ($number_of_existing_addresses > 0) {
	$row = mysql_fetch_assoc($result);
	$address_id = $row[id];
	$poi_id = $row[fk_poi_id];
	
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="poi already existing">';
	$xml .= '<poi id="'. $poi_id .'" />';
	$xml .= '</response>';
}
else {
	//if address doesn't exist, post new poi:
	$sql = 'INSERT INTO poi (fk_user_id) VALUES ("'. $user .'")';
	if ($result = @mysql_query($sql)) {
		$poi_id = mysql_insert_id();
	}
	
	$sql = 'INSERT INTO address (country, city, zip, street) VALUES ("'. $country .'", "'. $city .'", "'. $zip .'", "'. $street .'")';
	if ($result = @mysql_query($sql)) {
		$address_id = mysql_insert_id();
	}
	
	$sql = 'INSERT INTO address_master (fk_poi_id, fk_address_id) VALUES ("'. $poi_id .'", "'. $address_id .'")';
	if ($result = @mysql_query($sql)) {
		$address_master_id = mysql_insert_id();
	}
	
	$sql = 'INSERT INTO point (lng, lat) VALUES ("'. $lng .'", "'. $lat .'")';
	if ($result = @mysql_query($sql)) {
		$point_id = mysql_insert_id();
	}
	
	$sql = 'INSERT INTO point_master (fk_poi_id, fk_point_id) VALUES ("'. $poi_id .'", "'. $point_id .'")';
	if ($result = @mysql_query($sql)) {
		$point_master_id = mysql_insert_id();
	}
	
	$poi_id = mysql_insert_id();
	$xml .= '<?xml version="1.0" encoding="utf-8"?>';
	$xml .= '<response status="ok">';
	$xml .= '<poi id="'. $poi_id .'" />';
	$xml .= '</response>';
}
output_handler($xml);
mysql_close()
?>