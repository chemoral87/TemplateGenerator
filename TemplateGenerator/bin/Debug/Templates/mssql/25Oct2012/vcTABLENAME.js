#set ( $ajax = '$.ajax' )
function vc${NOMBRETABLA}(){
  /* table defaul values */
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount == 2 ) 
#set($firstColumn = ${element.column_name})
#end 
#end
#end 
 var  
  _btnDel,
  _btnIns,
  _btnRef,
  _btnSrch,
  _btnUpd,
  _dBx,
  _ds,
  _filterOne = "",
  _iBx,
  _iPgt,
  _isNew,
  _lBx,
  _mBx,
  _rowsSel,
  _rowsSelCln,
  _tb ;
  
 this.run = function(){  
   $("#divMainTitle").html("${NOMBRETABLA}");
   $("#divMain").show();
   doBx();
   doTb();
   doBtn();
   doVa();
 }  
 
 function doBx(){  // Se Crean las Cajas
  _mBx = new BxMgr('mBx');
  _mBx.init({width:"400px"});
  _dBx = new BxMgr('dBx');
  _dBx.init({width:"400px"});
  _dBx.setButtons([
   {text: "Si", handler: function(){delRows(); this.cancel()}},
   {text: "No", handler: function(){this.cancel()}}
  ]);
  _lBx = new BxMgr("lBx");
  _lBx.init({width:"auto",close:false});
  _iBx = new BxMgr("iBx");
  _iBx.init({width:"auto",drag:true});
  _iBx.setButtons([
   {text:"Guardar", handler : function(){save()}},
    {text:"Cancelar", handler : function(){this.cancel()}}
  ]);
 }
 
 function doBtn(){ // Se crean los botones de control
  _btnIns = new YW.Button("btnIns${Nombretabla}",{label:"Nuevo"});
  _btnIns.on("click",function(){
   _isNew = true;
   $("#iPgt").hide();
   var now = new Date();
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "int" || $element.data_type == "decimal" || $element.data_type == "numeric" )
   $("#i_${element.column_name}").val( "" );
#elseif ( $element.data_type == "bit" )
   U.isChecked("i_${element.column_name}",1);
#elseif ( $element.data_type == "date" || $element.data_type == "datetime" )  
   $("#i_${element.column_name}").datetimeEntry('setDatetime',new Date());
#else
   $("#i_${element.column_name}").val( "" );
#end
#end
#end
   _iBx.setHeader("Nuev@ ${Nombretabla}");
   _iBx.show();
  });
  
  _btnUpd = new YW.Button("btnUpd${Nombretabla}",{label:"Editar"});
  _btnUpd.on("click",function(){
   shwSel();
  });
  
  _btnDel = new YW.Button("btnDel${Nombretabla}",{label:"Eliminar"});
  _btnDel.on("click",function(){
   var rec = _tb.getSelectedRows();
   _rowsSel = [];
   for ( var i in rec ){
    _rowsSel.push( _tb.getRecord( rec[i]) );
   }
   if(rec.length > 0){
    _dBx.show([{Type:'c',Desc:"Desea eliminar el/los " + rec.length + " ${Nombretabla} seleccionado(s)?"}]);
   } else{
    _mBx.show([{Type:'w',Desc:"Debe seleccionar almenos 1 registro."}]);
   }
  });
  
  _btnRef = new YW.Button("btnRef${Nombretabla}",{label:"Refrescar"});
  _btnRef.on("click",function(){
   $("#i_Srch${Nombretabla}").val("");
   search();
  });
  
  _btnSrch = new YW.Button("btnSrch${Nombretabla}",{label:"Buscar"});
  _btnSrch.on("click",function(){
   search(); 
  });
  
 }
 
  function search(){
   _filterOne = $("#i_Srch${Nombretabla}").val();
   U.rDS( _tb, _ds, 0 );
  }
  
 function doTb(){
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "date" )
  YW.DataTable.Formatter.my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.dateFormat(dat,"%A, %d %B %Y");
  }
#elseif ($element.data_type == "bit" )  
  YW.DataTable.Formatter.my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = (dat == "1")? "Si" : ( dat == "0")? "No" : dat;
  };
#elseif ($element.data_type == "datetime" )  
  YW.DataTable.Formatter.my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.dateFormat(dat,"%A, %d %B %Y %r");
  }
#elseif ($element.data_type == "integer" )  
  YW.DataTable.Formatter.my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.intFormat( dat );
  };
#elseif ( ($element.data_type == "decimal" || $element.data_type == "int" || $element.data_type == "numeric" ) && $element.numeric_scale == "0" )  
  YW.DataTable.Formatter.my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.intFormat( dat );
  }; 
#elseif ( ($element.data_type == "decimal" || $element.data_type == "int" || $element.data_type == "numeric" ) && $element.numeric_scale != "0" ) 
  YW.DataTable.Formatter.my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.decFormat( dat );
  };   
#end
#end
#end

  var col = [ 
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, className:"css_center_th css_left_td"}
#elseif ($element.data_type == "bit" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, formatter:"my${element.column_name}", className:"css_center_th css_left_td"}
#elseif ($element.data_type == "date" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, formatter:"my${element.column_name}", className:"css_center_th css_left_td"}
#elseif ($element.data_type == "datetime" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, formatter:"my${element.column_name}", className:"css_center_th css_left_td"}
#elseif ( $element.data_type == "decimal" || $element.data_type == "int" || $element.data_type == "numeric" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true , formatter:"my${element.column_name}", className:"css_center_th css_right_td"}
#else
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true , className:"css_center_tr_right_td"}
#end 
#end
#end
  ];
  
  _ds = YU.DataSource(U.dataSet);
  _ds.responseType = YU.DataSource.TYPE_JSON;
  _ds.connMethodPost = true;
  _ds.responseSchema = {
   resultsList: "d.records",  
   fields: [
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount == 2 ) 
#set($firstColumn = ${element.column_name})
#end 
#if ( $element.data_type == "datetime" || $element.data_type == "date" )
   #if ( $velocityCount != 1 ) ,#else  #end {key:"${element.column_name}"}
#elseif ( $element.data_type == "numeric" || $element.data_type == "int" || $element.data_type == "decimal" )
   #if ( $velocityCount != 1 ) ,#else  #end {key:"${element.column_name}", parser:"number"}   
#else
   #if ( $velocityCount != 1 ) ,#else  #end {key:"${element.column_name}"}
#end
#end
#end
    , {key:"last_update_date"} 
   ],
   metaFields : U.metaFields
  };
  
  var dft = { pagination : {recordOffset : 0,rowsPerPage:5 }, sortedBy : { key : "${firstColumn}", dir:("yui-dt-"+ "desc")} };
  
  var tbPg = new YW.Paginator({   
    template: U.pgtTmplXLS
   ,rowsPerPage: dft.pagination.rowsPerPage
   ,pageReportTemplate : U.pgtRepTmpl
   ,rowsPerPageOptions : [5,10,15,30,40]
   ,pageLinks:10
  });   
  
  function genReq( st, slf ){
   st = st || dft;   
   var par = [];
   par.push(st.pagination.recordOffset);
   par.push(st.pagination.rowsPerPage);
   par.push(st.sortedBy.key);
   par.push(st.sortedBy.dir.substring(7));
   par.push(_filterOne);
   
   return U.JSONstring({ param : par  
      , token : $("#m_token").val() 
      , key : $("#KEY_${NOMBRETABLA}_SEL").val() });
  }
  
  var cfg = {
   paginator : tbPg,
   //selectionMode : "single",
   initialLoad: true,
   generateRequest : genReq,
   initialRequest: genReq(),
   sortedBy:{key:(dft.sortedBy.key),dir:(dft.sortedBy.dir)},
   dynamicData: true
   
  };
  
  _tb = new YW.DataTable("tb${Nombretabla}", col, _ds, cfg);
  
  _tb.doBeforeLoadData = U.doBeforeLoadData;
  U.tbDefaults(_tb);
  _tb.subscribe("dataReturnEvent", function(){ _lBx.hide(); });
  _tb.subscribe('rowDblclickEvent', function(ev){
   shwSel();
  });
  _tb.subscribe('postRenderEvent', function () {
     $(".ser_export_excel").unbind();
     $(".ser_export_excel").click(function () {
       expXLS();
     });
   });
 };
 
 function expXLS() {
   var tbRec = _tb.getRecordSet();
   var n = tbRec.getLength();
   if (n == 0) {
     _mBx.show([{ Type: "i", Desc: "No existen registros para exportar."}]);
     return false;
   }
   var tb = [];
   for (var i = 0; i < n; i++) {
     tb.push(tbRec.getRecord(i).getData());
   }
   var col = _tb.getColumnSet().getDefinitions();

   var exceptions = new Array("key", "label");
   col = U.filKeys(col, exceptions);

   var id = Number(new Date());

   var frm = document.createElement("form");
   frm.setAttribute("method", "post");
   frm.setAttribute("action", "reports/expXLS.aspx");
   frm.setAttribute("id", "frmA" + id);
   frm.setAttribute("target", "_parent");
   
   var params = [];
   params["col"] = col;
   params["tb"] = tb;

   var hf = document.createElement("input");
   hf.setAttribute("name", "filename");
   hf.setAttribute("value", "${NOMBRETABLA}");
   frm.appendChild(hf);
   hf = document.createElement("input");
   hf.setAttribute("name", "title");
   hf.setAttribute("value", "${NOMBRETABLA}");
   frm.appendChild(hf);

   for (var key in params) {
     hf = document.createElement("input");
     hf.setAttribute("name", key);
     hf.setAttribute("value", U.rmTags(U.JSONstring(params[key])));
     frm.appendChild(hf);
   }
   document.body.appendChild(frm);
   frm.submit();
   $('#frmA' + id).remove();
 }
 
 function doVa(){
  $(".p_search").keypress(function (e) {
   if (U.keyEnter(e)) {
    search();
   }
  });
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar")
 // $("#i_${element.column_name}");
#elseif ( ($element.data_type == "int" ||  $element.data_type == "numeric"  || $element.data_type == "decimal" ) && $element.numeric_scale  == 0 )
  $("#i_${element.column_name}").autoNumeric({aSep:",",aDec:".",mDec:${element.numeric_scale},dGroup:3,vMax:( ${element.numeric_precision} * 9 - 1) });
#elseif ( ($element.data_type == "int" ||  $element.data_type == "numeric"  || $element.data_type == "decimal" ) && $element.numeric_scale  != 0 )
  $("#i_${element.column_name}").autoNumeric({aSep:",",aDec:".",mDec:${element.numeric_scale},dGroup:3,vMax:((${element.numeric_precision}-${element.numeric_scale}) * 9 - 1) });
#elseif ($element.data_type == "date" )
  U.doCal("i_${element.column_name}", {pos:'left'} );
  $("#i_${element.column_name}").datetimeEntry({ datetimeFormat: 'D/O/Y', spinnerImage: '' });
#elseif ($element.data_type == "datetime")
  U.doCal("i_${element.column_name}", {pos:'left'} );
  $("#i_${element.column_name}").datetimeEntry({ datetimeFormat: 'D/O/Y h:M a', spinnerImage: '' });
#end
#end
#end
 }
 
 function vManda(){
   var message = "";
#foreach ( $element in $DataModel.Rows)
#if( $element.is_nullable == "NO" && $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $element.data_type == "decimal" || $element.data_type == "int" ||  $element.data_type == "numeric"  )
   if( !$("#i_${element.column_name}").val() ){
    /* _mBx.show([{Type:"i",Desc:( "Falta el valor ${element.column_name} " )}]);
	_lBx.hide();
	return false; */
	message += "Falta el valor ${element.column_name}<br/>";
   }
#elseif ( $element.data_type == "varchar" || $element.data_type == "nvarchar" ) 
   if( !$("#i_${element.column_name}").val() ){
    /* _mBx.show([{Type:"i",Desc:( "Falta el valor ${element.column_name} " )}]);
	_lBx.hide();
	return false; */
	message += "Falta el valor ${element.column_name}<br/>";
   } 
#elseif ( $element.data_type == "date" ) 
   if( !$("#i_${element.column_name}").val() ){
    /* _mBx.show([{Type:"i",Desc:( "Falta el valor ${element.column_name} " )}]);
	_lBx.hide();
	return false; */
	message += "Falta el valor ${element.column_name}<br/>";
   } 
#elseif ( $element.data_type == "datetime" ) 
   if( !$("#i_${element.column_name}").val() ){
    /* _mBx.show([{Type:"i",Desc:( "Falta el valor ${element.column_name} " )}]);
	_lBx.hide();
	return false; */
	message += "Falta el valor ${element.column_name}<br/>";
   } 
#end
#end
#end
  if (message) {
   _mBx.show([{ Type: "i", Desc: message}]);
   _lBx.hide();
   return false;
  } 
  return true;
 }
 
 function save(){
  
  if ( !vManda() ) return false;
  var post = "";
  var _Desc1 = "";
  var _Desc2 = "";
  if(_isNew){ 
   var rowsToIns = [];
   var row = [];
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $element.data_type == "decimal" || $element.data_type == "int" ||  $element.data_type == "numeric" ) 
   row.push( $("#i_${element.column_name}").autoNumericGet() );
#elseif ($element.data_type == "bit")
   row.push(U.isChecked("i_${element.column_name}"));     
#elseif ($element.data_type == "date")
   row.push( U.dateFormat($("#i_${element.column_name}").datetimeEntry('getDatetime'), "%Y-%m-%d" ) );
#elseif ($element.data_type == "datetime")
   row.push( U.dateFormat($("#i_${element.column_name}").datetimeEntry('getDatetime'), "%Y-%m-%d %H:%M:%S" ) );
#else
   row.push( $("#i_${element.column_name}").val() );
#end
#end
#end
   ;
   rowsToIns.push( row );
   post = { actions : rowsToIns 
      , token : $("#m_token").val()
      , key : $("#KEY_${NOMBRETABLA}_INS").val() };

   _Desc1 = "Se inserto: ";
   _Desc2 = " ${Nombretabla}";
  } 
  else {
   updRowSel( ( _iPgt.getState().page - 1 ) );
   var rowsToUpd = getRows("UPD");
   if ( rowsToUpd.length < 1 ){
    _lBx.hide();
    _mBx.show([{Type:"w",Desc:( "No se modificó ningún registro. " )}]);
    return false;
   }
   post = { actions : rowsToUpd  
      , token : $("#m_token").val() 
      , key : $("#KEY_${NOMBRETABLA}_UPD").val() };
   _Desc1 = "Se actualizaron : ";
   _Desc2 = " ${Nombretabla}";
  }
  function success(o){
   _lBx.hide();
   var env = o.d;
   if(  env.session_on  != "ok" ){
	U.logout(); return false;
   }
   if(env.error.status == 0){
    _iBx.hide();
	U.rDS( _tb, _ds );
    if(env.affRows > -1)
     _mBx.show([{Type:"i",Desc:(_Desc1 + env.affRows + _Desc2 + " <br/>Resumen:" + env.procMessage )}]);
    }
    else{
	 _mBx.show([{Type:"e",Desc:("Error :" + env.error.msg )}]); 
	}
   }
   U.ajax({url: U.abc, data: U.JSONstring(post), success: success, error: error});
   _lBx.show();
  }
  
  function error(o){ _lBx.hide(); _mBx.show([{Type:"e",Desc:"Vuelva a intentarlo."}]); }
 
  function shwSel(){ // Obtienen todas los Rows a editar
   _isNew = false;
   var rec = _tb.getSelectedRows();
   _rowsSel = [];
   for ( var i in rec ){
    _rowsSel.push( _tb.getRecord( rec[i]) );
   }
   _rowsSelCln = U.JSONstring( _rowsSel ); /* Rows Originales */
   if(rec.length > 0){
    $("#iPgt").show();
    _iPgt = new YW.Paginator({rowsPerPage: 1, totalRecords: rec.length, containers: "iPgt",
	template : U.pgtTmpl
   });
   function chReq(st) {
    if ( !vManda() ) return false;
    updRowSel( st.before.page - 1 );
	_iPgt.setState(st);
	shwRowSel( st.page - 1 );
   };
   _iPgt.subscribe('changeRequest', chReq );
   _iPgt.render();
   shwRowSel( 0 );
  } 
  else {
   _mBx.show([{Type:'w',Desc:"Debe seleccionar almenos 1 registro."}]);
  }
 }
 
 function shwRowSel(i){
  var row = _rowsSel[i]._oData;
  
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
  $("#i_${element.column_name}").val( row.${element.column_name} );
#elseif ( $element.data_type == "bit" )
  U.isChecked("i_${element.column_name}",row.${element.column_name});  
#elseif ( $element.data_type == "int" || $element.data_type == "numeric" || $element.data_type == "decimal" )
  $("#i_${element.column_name}").autoNumericSet( row.${element.column_name} ); 
#elseif ( $element.data_type == "date" || $element.data_type == "datetime" )
  $("#i_${element.column_name}").datetimeEntry('setDatetime', U.dateFormat(row.${element.column_name},'') );
#end
#end
#end
  _iBx.setHeader("Modificar ${Nombretabla}");
  _iBx.show();
 }
 
 function updRowSel(i){
  var dat = _rowsSel[i]._oData;
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
  dat.${element.column_name} = $("#i_${element.column_name}").val();   
#elseif (  $element.data_type == "bit" )
  dat.${element.column_name} = U.isChecked("i_${element.column_name}");  
#elseif (  $element.data_type == "int" || $element.data_type == "numeric" || $element.data_type == "decimal"  )
  dat.${element.column_name} = $("#i_${element.column_name}").autoNumericGet();
#elseif ( $element.data_type == "date" )
  dat.${element.column_name} = U.dateFormat($("#i_${element.column_name}").datetimeEntry('getDatetime'), "%Y-%m-%d" );
#elseif ( $element.data_type == "datetime" )
  dat.${element.column_name} = U.dateFormat($("#i_${element.column_name}").datetimeEntry('getDatetime'), "%Y-%m-%d %H:%M:%S" );
#end
#end
#end
 }
 
 function getRows(type){
   var recSet = [];
   if( type == "UPD"){
    var clon = U.JSONparse( _rowsSelCln ); /* comparando los Rows Originales  */
    for ( var i in _rowsSel ){
     if( !U.areSame( _rowsSel[i]._oData, clon[i]._oData ) ){
	  var row = [];
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
      row.push( _rowsSel[i]._oData.${element.column_name} );
#elseif ( $element.data_type == "bit" )
      row.push( _rowsSel[i]._oData.${element.column_name} );	 
#elseif ( $element.data_type == "int" || $element.data_type == "numeric" || $element.data_type == "decimal" )
      row.push( _rowsSel[i]._oData.${element.column_name} );
#elseif ( $element.data_type == "date" )
      row.push( _rowsSel[i]._oData.${element.column_name} );
#elseif ( $element.data_type == "datetime" )
      row.push( _rowsSel[i]._oData.${element.column_name} );
#end
#end
#end
	  row.push( _rowsSel[i]._oData.last_update_date );
	  recSet.push (  row  );
	 }
    }
   }
   else if( type == "DEL" ){
    for ( var i in _rowsSel ){
     var row = [];
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key == "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
     row.push( _rowsSel[i]._oData.${element.column_name} );
#end
#end	 
	 row.push( _rowsSel[i]._oData.last_update_date );
	 recSet.push (  row  );
    }
   }
   return recSet;
 }
 
 function delRows(){
  
  var rowsToDel = getRows("DEL");
  var post = { actions: rowsToDel, token: $("#m_token").val(), key: $("#KEY_${NOMBRETABLA}_DEL").val() };
  function success(o){ 
     _lBx.hide();
     var env = o.d;
     if(env.error.status == 0){ // FALSE
      if(  env.session_on != "ok"  ){
	   U.logout( env.session_on ); return false;
	  }
	  U.rDS( _tb, _ds );
      if(env.affRows > -1)
       _mBx.show([{Type:"i",Desc:"Se eliminaron " + env.affRows + " registro(s)  seleccionad@. <br/>Resumen:" + env.procMessage }]);
     }
     else{
	  _mBx.show([{Type:"e",Desc:("Error :" + env.error.msg )}]); 
	 }
    }
	U.ajax({ url: U.abc, data: U.JSONstring(post), success: success, error: error });
	_lBx.show();
 } 
} // FIN