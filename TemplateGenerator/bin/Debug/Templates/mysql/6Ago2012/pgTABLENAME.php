<?php
 header('Content-Type: text/html; charset=ISO-8859-1'); 
 session_start();
 require(  $_SERVER['DOCUMENT_ROOT']."/class/SecureKey.php");
?>
<fieldset id="divMain" >
 <legend id="divMainTitle"></legend>
   <input type="button" id="btnIns${NOMBRETB}" />
   <input type="button" id="btnUpd${NOMBRETB}" />
   <input type="button" id="btnRef${NOMBRETB}" />
   <input type="button" id="btnDel${NOMBRETB}" />
   <input type="text" class="p_search${NOMBRETB}" id="i_Srch${NOMBRETB}" /><input type="button" id="btnSrch${NOMBRETB}" />
 <div id="tb${NOMBRETB}"></div>
 <div id="iBx${NOMBRETB}">
  <div class="hd"></div>
  <div class="bd">
   <table>
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
    <tr>
     <td>${element.column_name}</td>
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
	 <td><input type="text" id="i_${element.column_name}" maxlength="${element.character_maximum_length}"/> 
#elseif ($element.data_type == "bit" )
     <td><input type="checkbox" id="i_${element.column_name}" />
#elseif ($element.data_type == "int" ||  $element.data_type == "numeric" || $element.data_type == "decimal"  )
     <td><input type="text" id="i_${element.column_name}" style="text-align:right" />
#elseif ( $element.data_type == "date" )
     <td><input type="text" id="i_${element.column_name}" style="width:70px" />
#elseif ( $element.data_type == "datetime" )
     <td><input type="text" id="i_${element.column_name}" style="width:140px" />
#end
#if ($element.is_nullable == "NO") * #end </td>
    </tr>
#end
#end                                              
   </table>
   <div id="iPgt${NOMBRETB}"></div>
  </div>
 </div>
 <input type="hidden" id="KEY_${NOMBRETABLA}_SEL" value="<?php echo SecureKey::GenerateKey("${NOMBRETABLA}_SEL"); ?>" />
 <input type="hidden" id="KEY_${NOMBRETABLA}_DEL" value="<?php echo SecureKey::GenerateKey("${NOMBRETABLA}_DEL"); ?>" />
 <input type="hidden" id="KEY_${NOMBRETABLA}_UPD" value="<?php echo SecureKey::GenerateKey("${NOMBRETABLA}_UPD"); ?>" />
 <input type="hidden" id="KEY_${NOMBRETABLA}_INS" value="<?php echo SecureKey::GenerateKey("${NOMBRETABLA}_INS"); ?>" />
 <div id="dBx${NOMBRETB}"></div>
 <div id="mBx"></div>
 <div id="lBx"><div class="hd">Cargando</div>
  <div class="bd"><center>
   <div>Espere un momento por favor...</div>
   <div class="ser_loader" ></div>
   </center> 
  </div></div> 
</fieldset>


