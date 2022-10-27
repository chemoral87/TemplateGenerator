-- DROP PROCEDURE IF EXISTS `${NOMBRETABLA}_INS` ;

CREATE PROCEDURE ${nombretabla}_ins(
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'int' )
  @${element.column_name} ${element.data_type},
#elseif ( ${element.data_type} == 'bit' )
  @${element.column_name} ${element.data_type},
#elseif ( ${element.data_type} == 'varchar' || ${element.data_type} == 'nvarchar' )
  @${element.column_name} ${element.data_type}( ${element.character_maximum_length} ),
#elseif ( ${element.data_type} == 'decimal' || ${element.data_type} == 'numeric' )
  @${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} ),
#elseif ( ${element.data_type} == 'date' )
  @${element.column_name} NVARCHAR( 10 ),
#elseif ( ${element.data_type} == 'datetime' )
  @${element.column_name} NVARCHAR( 19 ),
#end
#end
#end
  @RolId INT,
  @OrgId NVARCHAR(15),
  @user_id INT
) AS
BEGIN TRY
  SET NOCOUNT ON;
  SET DATEFORMAT ymd;
 
  INSERT INTO ${nombretabla} (
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
    ${element.column_name},
#end 
#end 
    creation_date,
    created_by,
    last_update_date,
    last_updated_by  )
  VALUES (
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'datetime' )
    @${element.column_name},
#elseif ( ${element.data_type} == 'date' )
    @${element.column_name},
#else
    @${element.column_name},
#end
#end
#end
    GETDATE(),
    @user_id,
    GETDATE(),
    @user_id  );
  SELECT @@rowcount as 'affRows', '&rarr; Registro insertado<br/>' as 'procMessage';
 
  SELECT 
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "date" )
    LEFT(CONVERT(VARCHAR,${element.column_name},120),10) AS ${element.column_name},
#elseif($element.data_type == "datetime" )
    CONVERT(VARCHAR,${element.column_name},120) ${element.column_name},
#elseif($element.data_type == "bit" )
    CONVERT(VARCHAR,${element.column_name}) ${element.column_name},
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
${element.column_name}  = @@identity
#end
#end
#end
END TRY
BEGIN CATCH
    /* 
	IF (  ERROR_NUMBER() = 2627 ) -- DUPLICADO
	    SELECT 0 AS 'affRows', ( '<br/>Ya existe un registro con el valor: ' + @p_varchar )AS 'procMessage';
		
			SELECT
				ERROR_NUMBER() AS ErrorNumber,
				ERROR_SEVERITY() AS ErrorSeverity,
				ERROR_STATE() AS ErrorState,
				ERROR_PROCEDURE() AS ErrorProcedure,
				ERROR_LINE() AS ErrorLine,
				ERROR_MESSAGE() AS ErrorMessage
		*/
   SELECT 0 AS 'affRows', ( '&rarr; Error: ' + CAST(ERROR_NUMBER() AS VARCHAR) + ' Message: ' + ERROR_MESSAGE() )AS 'procMessage';
END CATCH
