DROP PROCEDURE IF EXISTS `${NOMBRETABLA}_SEL` ;
DELIMITER $$
CREATE  PROCEDURE `${NOMBRETABLA}_SEL`( startIndex int(11), pageSize int(11), sort VARCHAR(100), dir VARCHAR(100), filter VARCHAR(100), puser_id int( 11 ) )
BEGIN
 DECLARE v_found_rows INT(11);
 DECLARE v_total_records INT(11);
 SET @q = CONCAT('SELECT 
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "date" )
#if( $velocityCount != 1 ) ,#else  #end IF( ${element.column_name} = 0,'''', DATE_FORMAT(${element.column_name},''%d%m%Y'')) AS ${element.column_name}
#elseif($element.data_type == "datetime" )
#if( $velocityCount != 1 ) ,#else  #end IF( ${element.column_name} = 0,'''',DATE_FORMAT(${element.column_name},''%d%m%Y%H%i%S'')) AS ${element.column_name}
#else
#if( $velocityCount != 1 ) ,#else  #end ${element.column_name}
#end
#end
#end
 , DATE_FORMAT(last_update_date,''%d%m%Y%H%i%S'') AS last_update_date
   FROM ${nombretabla} 
 ORDER BY ',sort,' ',dir,' LIMIT ',startIndex,',',(pageSize + startIndex));
 PREPARE STMT FROM  @q; 
 EXECUTE STMT; 
 
 SELECT FOUND_ROWS() 
 INTO   v_found_rows; 

 SELECT COUNT(*) 
 INTO   v_total_records
 FROM   ${nombretabla};
 
 SELECT v_total_records "totalRecords"
      , startIndex as "startIndex"
	  , sort as "sort"
	  , dir as "dir", pageSize  as "pageSize"
	  , (v_found_rows - startIndex)  as "recordsReturned";
END
