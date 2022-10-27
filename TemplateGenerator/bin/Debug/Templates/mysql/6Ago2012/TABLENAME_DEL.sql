DROP PROCEDURE IF EXISTS `${NOMBRETABLA}_DEL` ;
DELIMITER $$
CREATE  PROCEDURE `${NOMBRETABLA}_DEL`(
#set ($oCount = 1 )
#foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' )
#if ( $oCount != 1 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.numeric_precision} )
#elseif ( ${element.data_type} == 'varchar' )
#if ( $oCount != 1 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.character_maximum_length} )
#elseif ( ${element.data_type} == 'decimal' )
#if ( $oCount != 1 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} )
#elseif ( ${element.data_type} == 'date' || ${element.data_type} == 'datetime' )
#if ( $oCount != 1 ) ,#else  #end p${element.column_name} varchar( 4000 )
#end
#else
#set ($oCount = $oCount - 1 )
#end
#set ($oCount = $oCount + 1 )
#end
  ,puser_id int( 11 )
)
BEGIN

 DECLARE v_exists INT(11);
 
 SELECT COUNT(*)
 INTO v_exists
 FROM ${nombretabla} 
 WHERE #foreach( $element in $DataModel.Rows)
#if($element.column_key == "PRI")
#if( ${element.data_type} == 'int' )
#if( $velocityCount != 1 ) ,#else  #end ${element.column_name}  = p${element.column_name} ; 
#end
#end
#end
 
 IF ( v_exists > 0 ) THEN
  DELETE FROM ${nombretabla} 
  WHERE #foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' )
#if ( $velocityCount != 1 ) ,#else  #end ${element.column_name}  = p${element.column_name} ; 
#end
#end
#end
  SELECT ROW_COUNT() as 'affected_rows', '<br/>Registro eliminado.' as 'proc_message';
 ELSE
  SELECT '0' as 'affected_rows', '<br/>El Registro ya estaba eliminado.' as 'proc_message';
 END IF;
END
