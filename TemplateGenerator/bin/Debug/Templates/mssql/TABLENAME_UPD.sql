--DROP PROCEDURE IF EXISTS ${NOMBRETABLA}_UPD ;

CREATE PROCEDURE ${nombretabla}_upd(
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'int' || ${element.data_type} == 'bit' || ${element.data_type} == 'smallint' || ${element.data_type} == 'tinyint' )
  @${element.column_name} ${element.data_type},
#elseif ( ${element.data_type} == 'varchar' ||${element.data_type} == 'nvarchar' )
  @${element.column_name} ${element.data_type}( ${element.character_maximum_length} ),
#elseif ( (${element.data_type} == 'decimal' || ${element.data_type} == 'numeric' || ${element.data_type} == 'int') && ${element.numeric_scale} == 0  )
  @${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( (${element.data_type} == 'decimal' || ${element.data_type} == 'numeric' || ${element.data_type} == 'int') && ${element.numeric_scale} != 0  )
  @${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( ${element.data_type} == 'date' )
  @${element.column_name} NVARCHAR( 10 ),
#elseif ( ${element.data_type} == 'datetime' )
  @${element.column_name} NVARCHAR( 19 ),
#end
#end
#end
  @last_update_date NVARCHAR( 19 ),
  @RolId INT,
  @OrgId NVARCHAR(15),
  @user_id int
) AS
DECLARE 
  @EXISTS INT,
  @affRows INT;
  SET @EXISTS = 0;
BEGIN TRY
  SET NOCOUNT ON;
  SET DATEFORMAT ymd;
 
  UPDATE ${nombretabla} SET 
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if( ${element.data_type} == 'date' ) 
    ${element.column_name} = @${element.column_name},
#elseif ( ${element.data_type} == 'datetime' ) 
    ${element.column_name} = @${element.column_name},
#else
    ${element.column_name} = @${element.column_name},
#end
#end
#end
    last_update_date = GETDATE(),
    last_updated_by = @user_id
  WHERE #foreach ( $element in $DataModel.Rows)
#if( $element.column_key == "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
${element.column_name} = @${element.column_name}
#end 
#end  
  AND CONVERT(VARCHAR,ISNULL(last_update_date, creation_date),120) = @last_update_date ;
  SELECT @affRows = @@rowcount;
 
  IF ( @affRows = 0 ) BEGIN
    SELECT @EXISTS = COUNT(1)
    FROM ${nombretabla} 
    WHERE #foreach( $element in $DataModel.Rows)
#if($element.column_key == "PRI")
${element.column_name} = @${element.column_name}
#end
#end
  END ;
 
  IF ( @affRows = 0 AND @EXISTS = 0 ) BEGIN 
    SELECT '0' as 'affRows', '&rarr; El Registro ya estaba eliminado.<br/>' as 'procMessage';
    SELECT 0 AS is_exists;
  END ELSE BEGIN
    IF ( @EXISTS = 1 ) BEGIN
      SELECT '0' as 'affRows', '&rarr; Registro editado por otro usuario.<br/>' as 'procMessage';
    END ELSE BEGIN
      SELECT @affRows as 'affRows', '&rarr; Registro actualizado.<br/>' as 'procMessage';
    END
    SELECT 1 AS is_exists,
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "date" )
    LEFT(CONVERT(VARCHAR,${element.column_name},120),10) AS ${element.column_name},
#elseif($element.data_type == "datetime" )
    CONVERT(VARCHAR,${element.column_name},120) AS ${element.column_name},
#elseif($element.data_type == "bit" )
    CONVERT(VARCHAR,${element.column_name}) AS ${element.column_name},
#elseif($element.data_type == "decimal" || $element.data_type == "numeric")
    ISNULL(${element.column_name},'0')  ${element.column_name},
#else
    ${element.column_name},
#end
#end
#end
    CONVERT(VARCHAR, ISNULL(last_update_date,creation_date), 120) AS last_update_date
    FROM ${nombretabla}
    WHERE #foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
${element.column_name} = @${element.column_name}
#end
#end
  END
END TRY
BEGIN CATCH
    /* 
	IF (  ERROR_NUMBER() = 2627 ) -- DUPLICADO
	    SELECT 0 AS 'affRows', ( 'Ya existe un registro con el valor: ' + @p_varchar + '<br/>' )AS 'procMessage';
		
			SELECT
				ERROR_NUMBER() AS ErrorNumber,
				ERROR_SEVERITY() AS ErrorSeverity,
				ERROR_STATE() AS ErrorState,
				ERROR_PROCEDURE() AS ErrorProcedure,
				ERROR_LINE() AS ErrorLine,
				ERROR_MESSAGE() AS ErrorMessage
		*/
  SELECT 0 AS 'affRows', ( '&rarr; Error: ' + CAST(ERROR_NUMBER() AS VARCHAR) + ' Message: ' + ERROR_MESSAGE() + '<br/>' )AS 'procMessage';
END CATCH