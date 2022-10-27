DROP PROCEDURE IF EXISTS `${NOMBRETABLA}_UPD` ;
DELIMITER $$
CREATE  PROCEDURE `${NOMBRETABLA}_UPD`(
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'int' )
#if( $velocityCount != 1 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.numeric_precision} )
#elseif ( ${element.data_type} == 'varchar' )
#if( $velocityCount != 1 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.character_maximum_length} )
#elseif ( ${element.data_type} == 'decimal' )
#if( $velocityCount != 1 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} )
#elseif ( ${element.data_type} == 'date' || ${element.data_type} == 'datetime' )
#if( $velocityCount != 1 ) ,#else  #end p${element.column_name} varchar( 50 )
#end
#end
#end
 , plast_update_date varchar( 50 )
 , puser_id int( 11 )
 
 )
BEGIN
 DECLARE v_exists INT(11);
 DECLARE v_edited INT(11);
 
 SELECT COUNT(*)
 INTO v_exists
 FROM ${nombretabla} 
 WHERE #foreach( $element in $DataModel.Rows)
#if($element.column_key == "PRI" )
#if( $velocityCount != 1 ) ,#else  #end ${element.column_name}  = p${element.column_name} ; 
#end
#end

SELECT COUNT(*)
 INTO v_edited
 FROM ${nombretabla} 
 WHERE #foreach( $element in $DataModel.Rows)
#if($element.column_key == "PRI")
#if( $velocityCount != 1 ) ,#else  #end ${element.column_name}  = p${element.column_name}
#end
#end
 AND IFNULL(last_update_date,'OK') = IF( plast_update_date = '',IFNULL(last_update_date,'OK'), str_to_date( plast_update_date,'%d%m%Y%k%i%s' )  );
 
 IF ( v_exists = 0 ) THEN
  SELECT '0' as 'affected_rows', '<br/>El Registro ya estaba eliminado.' as 'proc_message';
 ELSEIF ( v_edited = 0 ) THEN
  SELECT '0' as 'affected_rows', '<br/>Registro editado por otro usuario.' as 'proc_message';
 ELSE
  UPDATE ${nombretabla} 
  SET 
  #foreach ( $element in $DataModel.Rows)
#if( $element.extra != "auto_increment" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if( ${element.data_type} == 'date' ) 
  #if( $velocityCount > 2 ) ,#else  #end ${element.column_name} = str_to_date( p${element.column_name},'%d%m%Y' )
#elseif ( ${element.data_type} == 'datetime' ) 
  #if( $velocityCount > 2 ) ,#else  #end ${element.column_name} = str_to_date( p${element.column_name},'%d%m%Y%k%i%s' )
#else
  #if( $velocityCount > 2 ) ,#else  #end ${element.column_name} = p${element.column_name}
#end
#end
#end
  , last_update_date =  NOW()
  , last_updated_by = puser_id
  WHERE
#foreach ( $element in $DataModel.Rows)
#if( $element.extra == "auto_increment" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount > 1 ) ,#else  #end ${element.column_name} = p${element.column_name}
#end 
#end  
;
  SELECT ROW_COUNT() as 'affected_rows', '<br/>Registro actualizado' as 'proc_message';
 END IF; 
END