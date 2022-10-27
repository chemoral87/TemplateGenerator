DROP PROCEDURE IF EXISTS `${nombretabla}_upd` ;
DELIMITER $$
CREATE  PROCEDURE `${nombretabla}_upd`(
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'int'  || ${element.data_type} == 'bit' || $element.data_type == "smallint" || $element.data_type == "tinyint" || $element.data_type == "mediumint" )
 _${element.column_name} ${element.data_type},
#elseif ( ${element.data_type} == 'varchar' )
 _${element.column_name} ${element.data_type}( ${element.character_maximum_length} ),
#elseif ( ${element.data_type} == 'decimal' )
 _${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( ${element.data_type} == 'date' )
 _${element.column_name} varchar( 10 ),
#elseif ( ${element.data_type} == 'datetime' )
 _${element.column_name} varchar( 19 ),
#end
#end
#end
 _last_update_date VARCHAR(19),
 _RolId INT,
 _OrgId VARCHAR(15),
 _User_id INT
 )
BEGIN
  DECLARE _exists INT;
  DECLARE _aff_rows INT;
  
  DECLARE EXIT handler for 1062 /* DUPLICATE */
  BEGIN
    SELECT 0 as 'affRows', '&rarr; Registro Duplicado.<br/>' as 'procMessage';
  END;
  
  UPDATE ${nombretabla} 
  SET 
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if( ${element.data_type} == 'date' ) 
  ${element.column_name} = _${element.column_name},
#elseif ( ${element.data_type} == 'datetime' ) 
  ${element.column_name} = _${element.column_name},
#else
  ${element.column_name} = _${element.column_name},
#end
#end
#end
  last_update_date =  NOW(),
  last_updated_by = _User_id
  WHERE #foreach ( $element in $DataModel.Rows)
#if( $element.column_key == "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount > 1 ) ,#else  #end ${element.column_name} = _${element.column_name}
#end 
#end  
  AND IFNULL(last_update_date, creation_date) = _last_update_date
  ;
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
  
  IF( _exists = 0 AND _aff_rows = 0) THEN
    SELECT '0' as 'affRows', '&rarr; El Registro ya estaba eliminado.<br/>' as 'procMessage';
    SELECT 0 AS is_exists;
  ELSE
    IF ( _exists = 1 ) THEN
      SELECT '0' as 'affRows', '&rarr; Registro editado por otro usuario.<br/>' as 'procMessage';
    ELSE
      SELECT _aff_rows as 'affRows', '&rarr; Registro actualizado.<br/>' as 'procMessage';
    END IF;
    
    SELECT 1 AS is_exists,
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "bit" )
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
END;