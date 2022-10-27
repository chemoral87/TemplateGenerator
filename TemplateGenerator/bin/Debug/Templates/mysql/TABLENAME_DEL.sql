DROP PROCEDURE IF EXISTS `${nombretabla}_del` ;
DELIMITER $$
CREATE  PROCEDURE `${nombretabla}_del`(
#set ($oCount = 1 )
#foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' )
  _${element.column_name} ${element.data_type}( ${element.numeric_precision} ),
#elseif ( ${element.data_type} == 'varchar' )
  _${element.column_name} ${element.data_type}( ${element.character_maximum_length} ),
#elseif ( ${element.data_type} == 'decimal' )
  _${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( ${element.data_type} == 'date' || ${element.data_type} == 'datetime' )
  _${element.column_name} varchar( 4000 ),
#end
#else
#set ($oCount = $oCount - 1 )
#end
#set ($oCount = $oCount + 1 )
#end
  _last_update_date VARCHAR( 19 ),
  _RolId INT,
  _OrgId VARCHAR(15),
  _user_id INT
)
BEGIN
  DECLARE _exists INT;
  DECLARE _aff_rows INT;
  SET _exists = 0;
 
  DELETE FROM ${nombretabla} 
  WHERE #foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' )
${element.column_name} = _${element.column_name}
#end
#end
#end
  AND IFNULL(last_update_date, creation_date) = _last_update_date ;
 
  SELECT ROW_COUNT()
  INTO _aff_rows;
 
  IF ( _aff_rows = 0 ) THEN
    SELECT COUNT(1) 
    INTO _exists
    FROM ${nombretabla} 
    WHERE #foreach ( $element in $DataModel.Rows)
#if( $element.column_key == "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
${element.column_name} = _${element.column_name};
#end 
#end  
  END IF;
  
  IF ( _exists = 0) THEN
    IF ( _aff_rows = 0 ) THEN
      SELECT '0' as 'affRows', '&rarr; El Registro ya estaba eliminado.<br/>' as 'procMessage';  
    ELSE
      SELECT _aff_rows as 'affRows', '&rarr; Registro eliminado<br/>' as 'procMessage';
    END IF;
    SELECT 0 AS is_exists;
  ELSE 
    SELECT '0' as 'affRows', '&rarr; Registro editado por otro usuario.<br/>' as 'procMessage';
    SELECT 1 AS is_exists,
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "bit" ||  $element.data_type == "int" )
    IFNULL(${element.column_name},0) AS ${element.column_name},
#elseif($element.data_type == "date" )
    DATE_FORMAT(${element.column_name},'%Y-%m-%d') AS ${element.column_name},
#elseif($element.data_type == "datetime" )
    DATE_FORMAT(${element.column_name},'%Y-%m-%d %H:%i:%S') AS ${element.column_name},
#else
    ${element.column_name},
#end
#end
#end
    DATE_FORMAT(IFNULL(last_update_date, creation_date),'%Y-%m-%d %H:%i:%S') AS last_update_date
    FROM ${nombretabla}
    WHERE #foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' )
${element.column_name} = _${element.column_name};
#end
#end
#end
  END IF;

END
