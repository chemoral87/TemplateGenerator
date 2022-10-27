<%@ Page Language="C#" %>
<fieldset id="divMain" >
 <legend id="divMainTitle"></legend>
   <input type="button" id="btnIns${Nombretabla}" />
   <input type="button" id="btnUpd${Nombretabla}" />
   <input type="button" id="btnRef${Nombretabla}" />
   <input type="button" id="btnDel${Nombretabla}" />
   <input type="text" class="p_search" id="i_Srch${Nombretabla}" /><input type="button" id="btnSrch${Nombretabla}" />
 <div id="tb${Nombretabla}"></div>
 <div id="iBx">
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
   <div id="iPgt"></div>
  </div>
 </div>
 <input type="hidden" id="KEY_${NOMBRETABLA}_SEL" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_SEL") ); %>" />
 <input type="hidden" id="KEY_${NOMBRETABLA}_DEL" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_DEL") ); %>" />
 <input type="hidden" id="KEY_${NOMBRETABLA}_UPD" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_UPD") ); %>" />
 <input type="hidden" id="KEY_${NOMBRETABLA}_INS" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_INS") ); %>" />
 <div id="mBx"></div>
 <div id="dBx"></div>
 <div id="lBx"><div class="hd">Cargando</div>
  <div class="bd"><center>
   <div>Espere un momento por favor...</div>
   <div class="ser_loader" ></div>
   </center> 
  </div></div> 
</fieldset> 


