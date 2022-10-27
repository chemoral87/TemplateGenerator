DROP PROCEDURE IF EXISTS `${nombretabla}_ins` ;
DELIMITER $$
CREATE  PROCEDURE `${nombretabla}_ins`(
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'int' || ${element.data_type} == 'bit' || $element.data_type == "smallint" || $element.data_type == "tinyint" || $element.data_type == "mediumint" )
  _${element.column_name} ${element.data_type},
#elseif ( ${element.data_type} == 'varchar' )
  _${element.column_name} ${element.data_type}( ${element.character_maximum_length} ),
#elseif ( ${element.data_type} == 'decimal' )
  _${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( ${element.data_type} == 'datetime' )
  _${element.column_name} varchar( 19 ),
#elseif ( ${element.data_type} == 'date' )
  _${element.column_name} varchar( 10 ),
#end
#end
#end
  _RolId INT,
  _OrgId VARCHAR(15),
  _user_id INT
)
BEGIN
  DECLARE _identity INT;
  
  DECLARE EXIT handler for 1062 /* DUPLICATE */
  BEGIN
    SELECT 0 as 'affRows', '&rarr; Registro Duplicado.<br/>' as 'procMessage';
  END;
  
  INSERT INTO ${nombretabla} (
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
    ${element.column_name},
#end 
#end 
    created_by,
    creation_date
  )
  VALUES (
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'datetime' )
    _${element.column_name},
#elseif ( ${element.data_type} == 'date' )
    _${element.column_name},
#else
    _${element.column_name},
#end
#end
#end
    _user_id,
    NOW()
  );
  SELECT ROW_COUNT() as 'affRows', '&rarr; Registro insertado<br/>' as 'procMessage';
  SELECT LAST_INSERT_ID()
  INTO _identity;
  
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
${element.column_name} = _identity;
#end
#end
#end
END
