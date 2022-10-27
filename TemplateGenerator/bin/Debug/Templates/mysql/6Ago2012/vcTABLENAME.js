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
  _dBx${NOMBRETB},
  _ds${NOMBRETB},
  _filterOne${NOMBRETB} = "",
  _iBx${NOMBRETB},
  _iPgt${NOMBRETB},
  _isNew${NOMBRETB},
  _lBx,
  _mBx,
  _selRows${NOMBRETB},
  _selRowsCln${NOMBRETB},
  _tb${NOMBRETB} ;
  
 this.run = function(){  
   $("#divMainTitle").html("${Nombretabla}");
   $("#divMain").show();
   doBx();
   doTb${NOMBRETB}();
   doBtn();
   doVa();
 }  
 
 function doBx(){  // Se Crean las Cajas
  
  _dBx${NOMBRETB} = new BxMgr('dBx${NOMBRETB}');
  _dBx${NOMBRETB}.init({width:"400px"});
  _dBx${NOMBRETB}.setButtons([
   {text: "Si", handler: function(){delete${NOMBRETB}(); this.cancel()}},
   {text: "No", handler: function(){this.cancel()}}
  ]);
  
  _iBx${NOMBRETB} = new BxMgr("iBx${NOMBRETB}");
  _iBx${NOMBRETB}.init({width:"auto",drag:true});
  _iBx${NOMBRETB}.setButtons([
    {text:"Guardar", handler : function(){save${NOMBRETB}()}}
   ,{text:"Cancelar", handler : function(){this.cancel()}}
  ]);
  _mBx = new BxMgr('mBx');
  _mBx.init({width:"400px"});
  _lBx = new BxMgr("lBx");
  _lBx.init({width:"auto",close:false});
 }
 
 function doBtn(){ // Se crean los botones de control
  var _btnIns${NOMBRETB} = new YW.Button("btnIns${NOMBRETB}",{label:"Nuevo"});
  _btnIns${NOMBRETB}.on("click",function(){
   _isNew${NOMBRETB} = true;
   $("#iPgt${NOMBRETB}").hide();
   
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "int" || $element.data_type == "decimal" || $element.data_type == "numeric" )
   $("#i_${element.column_name}").val( "" );
#elseif ( $element.data_type == "bit" )
   $("#i_${element.column_name}").isChecked(1);
#elseif ( $element.data_type == "date" || $element.data_type == "datetime" )  
   $("#i_${element.column_name}").datetimeEntry('setDatetime',new Date());
#else
   $("#i_${element.column_name}").val( "" );
#end
#end
#end
   _iBx${NOMBRETB}.setHeader("Nuev@ ${NOMBRETB}");
   _iBx${NOMBRETB}.show();
  });
  
  var _btnUpd${NOMBRETB} = new YW.Button("btnUpd${NOMBRETB}",{label:"Editar"});
  _btnUpd${NOMBRETB}.on("click",function(){
   shwSelRows${NOMBRETB}();
  });
  
  var _btnDel${NOMBRETB} = new YW.Button("btnDel${NOMBRETB}",{label:"Eliminar"});
  _btnDel${NOMBRETB}.on("click",function(){
   var rec = _tb${NOMBRETB}.getSelectedRows();
   _selRows${NOMBRETB} = [];
   for ( var i in rec ){
    _selRows${NOMBRETB}.push( _tb${NOMBRETB}.getRecord( rec[i]) );
   }
   if(rec.length > 0){
    _dBx${NOMBRETB}.show([{Type:'c',Desc:"Desea eliminar el/los " + rec.length + " ${Nombretabla} seleccionado(s)?"}]);
   } else{
    _mBx.show([{Type:'w',Desc:"Debe seleccionar almenos 1 registro."}]);
   }
  });
  
  var _btnRef${NOMBRETB} = new YW.Button("btnRef${NOMBRETB}",{label:"Refrescar"});
  _btnRef${NOMBRETB}.on("click",function(){
   $("#i_Srch${NOMBRETB}").val("");
   search${NOMBRETB}();
  });
  
  var _btnSrch${NOMBRETB} = new YW.Button("btnSrch${NOMBRETB}",{label:"Buscar"});
  _btnSrch${NOMBRETB}.on("click",function(){
   search${NOMBRETB}(); 
  });
  
 }
 
  function search${NOMBRETB}(){
   _filterOne${NOMBRETB} = $("#i_Srch${NOMBRETB}").val();
   U.rDS( _tb${NOMBRETB}, _ds${NOMBRETB}, 0 );
  }
  
 function doTb${NOMBRETB}(){
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
  
  _ds${NOMBRETB} = YU.DataSource(U.dataSet);
  _ds${NOMBRETB}.responseType = YU.DataSource.TYPE_JSON;
  _ds${NOMBRETB}.connMethodPost = true;
  _ds${NOMBRETB}.responseSchema = {
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
  
  var dft = { pagination : {recordOffset : 0, rowsPerPage:5 }, sortedBy : { key : "${firstColumn}", dir:("yui-dt-"+ "desc")} };
  
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
   par.push(_filterOne${NOMBRETB});
   
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
   sortedBy:{key: dft.sortedBy.key, dir: dft.sortedBy.dir},
   dynamicData: true
   
  };
  
  _tb${NOMBRETB} = new YW.DataTable("tb${NOMBRETB}", col, _ds${NOMBRETB}, cfg);
  
  U.tbDefaults(_tb${NOMBRETB});
  
  _tb${NOMBRETB}.subscribe('rowDblclickEvent', function(ev){
   shwSelRows${NOMBRETB}();
  });
  _tb${NOMBRETB}.subscribe('postRenderEvent', function () {
     this.unselectAllRows();
     //this.selectRow(0);
     $(".ser_export_excel").unbind();
     $(".ser_export_excel").click(function () {
       expXLS();
     });
   });
 };
 
 function expXLS() {
   var tbRec = _tb${NOMBRETB}.getRecordSet();
   var n = tbRec.getLength();
   if (n == 0) {
     _mBx.show([{ Type: "i", Desc: "No existen registros para exportar."}]);
     return false;
   }
   var tb = [];
   for (var i = 0; i < n; i++) {
     tb.push(tbRec.getRecord(i).getData());
   }
   var col = _tb${NOMBRETB}.getColumnSet().getDefinitions();

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
  $(".p_search${NOMBRETB}").keypress(function (e) {
   if (U.keyEnter(e)) {
    search${NOMBRETB}();
   }
  });
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar")
 // $("#i_${element.column_name}");
#elseif ( $element.data_type == "int" )
  $("#i_${element.column_name}").autoNumeric({aSep:",",aDec:".",mDec:${element.numeric_scale},dGroup:3,vMax: 2147483647 });
#elseif ( $element.data_type == "int" ||  $element.data_type == "numeric"  || $element.data_type == "decimal" )
  $("#i_${element.column_name}").autoNumeric({aSep:",",aDec:".",mDec:${element.numeric_scale},dGroup:3,vMax: (Math.pow(10, (${element.numeric_precision}-${element.numeric_scale}) ) - ( 1 / Math.pow(10,${element.numeric_scale} )  )  ) });
#elseif ($element.data_type == "date" )
  U.doCal("i_${element.column_name}" );
  $("#i_${element.column_name}").datetimeEntry({ datetimeFormat: 'D/O/Y'});
#elseif ($element.data_type == "datetime")
  U.doCal("i_${element.column_name}" );
  $("#i_${element.column_name}").datetimeEntry({ datetimeFormat: 'D/O/Y h:M a'});
#end
#end
#end
 }
 
 function vManda${NOMBRETB}(){
   var message = "";
#foreach ( $element in $DataModel.Rows)
#if( $element.is_nullable == "NO" && $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $element.data_type == "decimal" || $element.data_type == "int" ||  $element.data_type == "numeric"  )
   if( !$("#i_${element.column_name}").val() ){
	message += "Falta el valor ${element.column_name}<br/>";
   }
#elseif ( $element.data_type == "varchar" || $element.data_type == "nvarchar" ) 
   if( !$("#i_${element.column_name}").val() ){
	message += "Falta el valor ${element.column_name}<br/>";
   } 
#elseif ( $element.data_type == "date" ) 
   if( !$("#i_${element.column_name}").val() ){
	message += "Falta el valor ${element.column_name}<br/>";
   } 
#elseif ( $element.data_type == "datetime" ) 
   if( !$("#i_${element.column_name}").val() ){
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
 
 function save${NOMBRETB}(){
  
  if ( !vManda${NOMBRETB}() ) return false;
   var post = "";
   var _Desc1 = "";
   var _Desc2 = "";
   if(_isNew${NOMBRETB}){ 
    var rowsToIns = [];
    var row = [];
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $element.data_type == "decimal" || $element.data_type == "int" ||  $element.data_type == "numeric" ) 
    row.push( $("#i_${element.column_name}").autoNumericGet() );
#elseif ($element.data_type == "bit")
    row.push( $("#i_${element.column_name}").isChecked() );     
#elseif ($element.data_type == "date")
    row.push( U.dateFormat($("#i_${element.column_name}").datetimeEntry('getDatetime'), "%Y-%m-%d" ) );
#elseif ($element.data_type == "datetime")
    row.push( U.dateFormat($("#i_${element.column_name}").datetimeEntry('getDatetime'), "%Y-%m-%d %H:%M:%S" ) );
#else
    row.push( $("#i_${element.column_name}").val() );
#end
#end
#end
   
    rowsToIns.push( row );
    post = { actions : rowsToIns 
      , token : $("#m_token").val()
      , key : $("#KEY_${NOMBRETABLA}_INS").val() };

    _Desc1 = "Se inserto: ";
    _Desc2 = " ${Nombretabla}";
   } 
   else {
    updSelRow${NOMBRETB}( ( _iPgt${NOMBRETB}.getState().page - 1 ) );
    var rowsToUpd = getRows${NOMBRETB}("UPD");
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
     if(env.affRows > 0){
	  _iBx${NOMBRETB}.hide();
	  U.rDS( _tb${NOMBRETB}, _ds${NOMBRETB} );
	 }
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
 
  function shwSelRows${NOMBRETB}(){ // Obtienen todas los Rows a editar
   _isNew${NOMBRETB} = false;
   var rec = _tb${NOMBRETB}.getSelectedRows();
   _selRows${NOMBRETB} = [];
   for ( var i in rec ){
    _selRows${NOMBRETB}.push( _tb${NOMBRETB}.getRecord( rec[i]) );
   }
   _selRowsCln${NOMBRETB} = U.JSONstring( _selRows${NOMBRETB} ); /* Rows Originales */
   if(rec.length > 0){
    $("#iPgt${NOMBRETB}").show();
    _iPgt${NOMBRETB} = new YW.Paginator({rowsPerPage: 1, totalRecords: rec.length, containers: "iPgt${NOMBRETB}",
	template : U.pgtTmpl
   });
   function chReq(st) {
    if ( !vManda${NOMBRETB}() ) return false;
    updSelRow${NOMBRETB}( st.before.page - 1 );
	_iPgt${NOMBRETB}.setState(st);
	shwSelRow${NOMBRETB}( st.page - 1 );
   };
   _iPgt${NOMBRETB}.subscribe('changeRequest', chReq );
   _iPgt${NOMBRETB}.render();
   shwSelRow${NOMBRETB}( 0 );
  } 
  else {
   _mBx.show([{Type:'w',Desc:"Debe seleccionar almenos 1 registro."}]);
  }
 }
 
 function shwSelRow${NOMBRETB}(i){
  var row = _selRows${NOMBRETB}[i]._oData;
  
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
  $("#i_${element.column_name}").val( row.${element.column_name} );
#elseif ( $element.data_type == "bit" )
  $("#i_${element.column_name}").isChecked(row.${element.column_name});  
#elseif ( $element.data_type == "int" || $element.data_type == "numeric" || $element.data_type == "decimal" )
  $("#i_${element.column_name}").autoNumericSet( row.${element.column_name} ); 
#elseif ( $element.data_type == "date" || $element.data_type == "datetime" )
  $("#i_${element.column_name}").datetimeEntry('setDatetime', U.dateFormat(row.${element.column_name},'') );
#end
#end
#end
  _iBx${NOMBRETB}.setHeader("Modificar ${Nombretabla}");
  _iBx${NOMBRETB}.show();
 }
 
 function updSelRow${NOMBRETB}(i){
  var dat = _selRows${NOMBRETB}[i]._oData;
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
  dat.${element.column_name} = $("#i_${element.column_name}").val();   
#elseif (  $element.data_type == "bit" )
  dat.${element.column_name} = $("#i_${element.column_name}").isChecked();  
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
 
 function getRows${NOMBRETB}(type){
   var recSet = [];
   if( type == "UPD"){
    var clon = U.JSONparse( _selRowsCln${NOMBRETB} ); /* comparando los Rows Originales  */
    for ( var i in _selRows${NOMBRETB} ){
     if( !U.areSame( _selRows${NOMBRETB}[i]._oData, clon[i]._oData ) ){
	  var row = [];
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
      row.push( _selRows${NOMBRETB}[i]._oData.${element.column_name} );
#elseif ( $element.data_type == "bit" )
      row.push( _selRows${NOMBRETB}[i]._oData.${element.column_name} );	 
#elseif ( $element.data_type == "int" || $element.data_type == "numeric" || $element.data_type == "decimal" )
      row.push( _selRows${NOMBRETB}[i]._oData.${element.column_name} );
#elseif ( $element.data_type == "date" )
      row.push( _selRows${NOMBRETB}[i]._oData.${element.column_name} );
#elseif ( $element.data_type == "datetime" )
      row.push( _selRows${NOMBRETB}[i]._oData.${element.column_name} );
#end
#end
#end
	  row.push( _selRows${NOMBRETB}[i]._oData.last_update_date );
	  recSet.push (  row  );
	 }
    }
   }
   else if( type == "DEL" ){
    for ( var i in _selRows${NOMBRETB} ){
     var row = [];
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key == "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
     row.push( _selRows${NOMBRETB}[i]._oData.${element.column_name} );
#end
#end	 
	 row.push( _selRows${NOMBRETB}[i]._oData.last_update_date );
	 recSet.push (  row  );
    }
   }
   return recSet;
 }
 
 function delete${NOMBRETB}(){
  
  var rowsToDel = getRows${NOMBRETB}("DEL");
  var post = { actions: rowsToDel, token: $("#m_token").val(), key: $("#KEY_${NOMBRETABLA}_DEL").val() };
  function success(o){ 
     _lBx.hide();
     var env = o.d || U.session_off;
	 if(  env.session_on != "ok"  ){
	   U.logout( env.session_on ); return false;
	 }
     if(env.error.status == 0){ // FALSE
	  U.rDS( _tb${NOMBRETB}, _ds${NOMBRETB} );
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