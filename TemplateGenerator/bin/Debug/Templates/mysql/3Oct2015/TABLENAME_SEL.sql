DROP PROCEDURE IF EXISTS `${nombretabla}_sel` ;
DELIMITER $$
CREATE  PROCEDURE `${nombretabla}_sel`( 
  _startIndex INT
 ,_pageSize INT
 ,_sort VARCHAR(100)
 ,_dir VARCHAR(100)
 ,_filter VARCHAR(100)
 ,_RoleId INT
 ,_OrgId VARCHAR(15)
 ,_user_id INT 
)
BEGIN
 DECLARE _aff_rows INT(11);
 DECLARE total_records INT(11);
 SET @q = CONCAT('SELECT 
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "bit" ||  $element.data_type == "int" )
#if( $velocityCount != 1 ) ,#else  #end IFNULL(${element.column_name},0) AS ${element.column_name}
#elseif($element.data_type == "date" )
#if( $velocityCount != 1 ) ,#else  #end DATE_FORMAT(${element.column_name},''%Y-%m-%d'') AS ${element.column_name}
#elseif($element.data_type == "datetime" )
#if( $velocityCount != 1 ) ,#else  #end DATE_FORMAT(${element.column_name},''%Y-%m-%d %H:%i:%S'') AS ${element.column_name}
#else
#if( $velocityCount != 1 ) ,#else  #end ${element.column_name}
#end
#end
#end
 , DATE_FORMAT(last_update_date,''%Y-%m-%d %H:%i:%S'') AS last_update_date
   FROM ${nombretabla} 
 ORDER BY ',_sort,' ',_dir,' LIMIT ',_startIndex,',',(_pageSize + _startIndex));
 PREPARE STMT FROM  @q; 
 EXECUTE STMT; 
 
 SELECT FOUND_ROWS() 
 INTO   _aff_rows; 

 SELECT COUNT(1) 
 INTO   total_records
 FROM   ${nombretabla};
 
 SELECT total_records "totalRecords"
      , _startIndex as "startIndex"
	  , _sort as "sort"
	  , _dir as "dir", _pageSize  as "pageSize"
	  , _aff_rows  as "recordsReturned";
END
