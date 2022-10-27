--DROP PROCEDURE IF EXISTS ${nombretabla}_SEL ;

CREATE PROCEDURE ${nombretabla}_sel( 
  @startIndex INT, 
  @pageSize INT, 
  @sort NVARCHAR(100), 
  @dir NVARCHAR(100), 
  @filter NVARCHAR(100), 
  @RolId INT,
  @OrgId NVARCHAR(15),
  @user_id INT
) AS
DECLARE 
  @q AS NVARCHAR(4000),
  @total_records AS INT,
  @aff_rows AS INT; 
BEGIN
  SET NOCOUNT ON;
  SET DATEFORMAT ymd;
 
  SET @q = 'SELECT 
#foreach ( $element in $DataModel.Rows) 
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if($element.data_type == "date" )
    LEFT(CONVERT(VARCHAR,${element.column_name},120),10) ${element.column_name},
#elseif($element.data_type == "datetime" )
    CONVERT(VARCHAR,${element.column_name},120) ${element.column_name},
#elseif($element.data_type == "bit" )
    CONVERT(INT,${element.column_name}) ${element.column_name},
#elseif( ($element.data_type == "decimal" || $element.data_type == "numeric" || $element.data_type == "int") && $element.column_key != "PRI" )
    ISNULL(${element.column_name},0) ${element.column_name},
#else
    ${element.column_name},
#end
#end
#end
  CONVERT(VARCHAR, last_update_date, 120) AS last_update_date
  FROM ${nombretabla}  
  ORDER BY '+  @sort +' '+  @dir +'
  OFFSET '+ CONVERT(VARCHAR,(@startIndex)) +' ROWS 
  FETCH NEXT '+ CONVERT(VARCHAR,(@pageSize)) +' ROWS ONLY ';

  EXECUTE(@q); 
  SELECT @aff_rows = @@rowcount;
 
  SELECT @total_records = COUNT(1) 
  FROM ${nombretabla};
 
  SELECT @total_records "totalRecords",
    @startIndex "startIndex",
    @sort "sort",
    @dir "dir",
    @pageSize "pageSize",
    @aff_rows "recordsReturned";
END
