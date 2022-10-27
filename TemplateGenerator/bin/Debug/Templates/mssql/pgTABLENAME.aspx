<%@ Page Language="C#" %>
<fieldset id="divMain" >
  <legend id="divMainTitle"></legend>
  <input type="button" id="btnIns${NOMBRETB}" />
  <input type="button" id="btnUpd${NOMBRETB}" />
  <input type="button" id="btnRef${NOMBRETB}" />
  <input type="button" id="btnDel${NOMBRETB}" />
  <input type="text" class="p_search${NOMBRETB}" id="i_Srch${NOMBRETB}" /><input type="button" id="btnSrch${NOMBRETB}" />
  <div id="form${NOMBRETB}"></div>
</fieldset> 
<input type="hidden" id="KEY_${NOMBRETABLA}_SEL" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_SEL") ); %>" />
<input type="hidden" id="KEY_${NOMBRETABLA}_DEL" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_DEL") ); %>" />
<input type="hidden" id="KEY_${NOMBRETABLA}_UPD" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_UPD") ); %>" />
<input type="hidden" id="KEY_${NOMBRETABLA}_INS" value="<% Response.Write( SecureKey.GenerateKey("${NOMBRETABLA}_INS") ); %>" />

