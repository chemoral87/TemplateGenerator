DROP PROCEDURE IF EXISTS `${NOMBRETABLA}_INS` ;
DELIMITER $$
CREATE  PROCEDURE `${NOMBRETABLA}_INS`(
#foreach ( $element in $DataModel.Rows)
#if( $element.extra != "auto_increment" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'int' )
#if ( $velocityCount > 2 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.numeric_precision} )
#elseif ( ${element.data_type} == 'varchar' )
#if ( $velocityCount > 2 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.character_maximum_length} )
#elseif ( ${element.data_type} == 'decimal' )
#if ( $velocityCount > 2 ) ,#else  #end p${element.column_name} ${element.data_type}( ${element.numeric_precision},${element.numeric_scale} )
#elseif ( ${element.data_type} == 'date' || ${element.data_type} == 'datetime' )
#if ( $velocityCount > 2 ) ,#else  #end p${element.column_name} varchar( 4000 )
#end
#end
#end
 , puser_id int( 11 )
)
BEGIN
 INSERT INTO ${nombretabla} (
#foreach ( $element in $DataModel.Rows)
#if( $element.extra != "auto_increment" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if( $velocityCount > 2 ) ,#else  #end ${element.column_name}
#end 
#end 
 , creation_date
 , last_update_date
 , created_by
 , last_updated_by
 )
 VALUES (
#foreach ( $element in $DataModel.Rows)
#if( $element.extra != "auto_increment" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( ${element.data_type} == 'datetime' )
#if( $velocityCount > 2 ) ,#else  #end str_to_date(p${element.column_name},'%d%m%Y%k%i%s')
#elseif ( ${element.data_type} == 'date' )
#if( $velocityCount > 2 ) ,#else  #end str_to_date(p${element.column_name},'%d%m%Y')
#else
#if( $velocityCount > 2 ) ,#else  #end p${element.column_name}
#end
#end
#end
 , now()
 , now()
 , puser_id
 , puser_id
 );
 SELECT ROW_COUNT() as 'affected_rows', '<br/>Registro insertado' as 'proc_message';
END
