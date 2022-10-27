<?php
  session_start();
 require("keyGenerator.php");
?>
<div id="divMain" >
 <h4 id="divMainTitle">$Nombretabla</h4>
 <hr/>
 <table>
  <tr>
   <td><input type="button" id="btnRef${Nombretabla}" /></td>
   <td><input type="text" id="i_Srch${Nombretabla}" /><input type="button" id="btnSrch${Nombretabla}" /></td>
  </tr>
 </table>
 <hr/>
 <div id="tb${Nombretabla}"></div>
 <input type="hidden" id="KEY_${NOMBRETABLA}_SEL" value="<?php echo generateKey('${NOMBRETABLA}_SEL') ?>" />
 <div id="mBx"></div>
 <div id="lBx"><div class="hd">Cargando</div>
  <div class="bd"><center>
   <div>Espere un momento por favor...</div>
   <div class="ser_loader" ></div>
   </center> 
  </div></div>
</div> 


