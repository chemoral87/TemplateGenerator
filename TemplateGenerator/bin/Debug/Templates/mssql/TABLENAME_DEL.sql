--DROP PROCEDURE IF EXISTS `${NOMBRETABLA}_DEL` ;

CREATE PROCEDURE ${nombretabla}_del(
#set ($oCount = 1 )
#foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' || ${element.data_type} == 'smallint' || ${element.data_type} == 'tinyint' )
  @${element.column_name} ${element.data_type} ,
#elseif ( ${element.data_type} == 'varchar' )
  @${element.column_name} ${element.data_type}( ${element.character_maximum_length},
#elseif ( ${element.data_type} == 'decimal' || ${element.data_type} == 'numeric' )
  @${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( ${element.data_type} == 'date' )
  @${element.column_name} NVARCHAR( 8 ),
#elseif ( ${element.data_type} == 'datetime' )
  @${element.column_name} NVARCHAR( 15 ),
#end
#else
#set ($oCount = $oCount - 1 )
#end
#set ($oCount = $oCount + 1 )
#end
  @last_update_date NVARCHAR( 19 ),
  @RolId INT,
  @OrgId NVARCHAR(15),
  @user_id INT
) AS
DECLARE 
  @EXISTS INT,
  @affRows INT;
  SET @EXISTS = 0;
BEGIN TRY
  SET NOCOUNT ON;
  SET DATEFORMAT ymd;
 
  DELETE FROM ${nombretabla} 
    WHERE#foreach( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
 ${element.column_name} = @${element.column_name} 
#end
#end
    AND CONVERT(VARCHAR,COALESCE(last_update_date,creation_date),120) = @last_update_date;
   
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

  IF ( @EXISTS = 0 ) BEGIN 
    IF ( @affRows = 0 ) BEGIN
      SELECT '0' as 'affRows', '&rarr; El Registro ya estaba eliminado.<br/>' as 'procMessage';  
    END ELSE BEGIN
      SELECT @affRows as 'affRows', '&rarr; Registro eliminado<br/>' as 'procMessage';
    END
    SELECT 0 AS is_exists;
  END ELSE BEGIN   
    SELECT '0' as 'affRows', '&rarr; Registro editado por otro usuario.<br/>' as 'procMessage';
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
      ISNULL(${element.column_name},'0') ${element.column_name},
#else
      ${element.column_name},
#end
#end
#end
    CONVERT(VARCHAR, last_update_date, 120) AS last_update_date
    FROM ${nombretabla}
    WHERE #foreach ( $element in $DataModel.Rows)
#if ($element.column_key == "PRI")
#if ( ${element.data_type} == 'int' )
${element.column_name} = @${element.column_name}
#end
#end
#end
  END
END TRY
BEGIN CATCH
 /* 
	IF (  ERROR_NUMBER() = 2627 ) -- DUPLICADO
	    SELECT 0 AS 'affRows', ( '<br/>Ya existe un registro con el valor: ' + @pp_varchar )AS 'procMessage';
		
			SELECT
				ERROR_NUMBER() AS ErrorNumber,
				ERROR_SEVERITY() AS ErrorSeverity,
				ERROR_STATE() AS ErrorState,
				ERROR_PROCEDURE() AS ErrorProcedure,
				ERROR_LINE() AS ErrorLine,
				ERROR_MESSAGE() AS ErrorMessage
		*/
  SELECT 0 AS 'affRows', ( '--> Error: ' + CAST(ERROR_NUMBER() AS VARCHAR) + ' Message: ' + ERROR_MESSAGE() + '<br/>' )AS 'procMessage';
END CATCH
