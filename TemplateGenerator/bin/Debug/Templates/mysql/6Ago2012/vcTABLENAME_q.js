function vc${NOMBRETABLA}_q(){
 
 var x = YAHOO.namespace("${NOMBRETABLA}");
	
 this.run = function(){  
  x.doBx();
  x.doBtn();
  x.doTb();
  x.doEv();
  
  $(document).ready(function() {
   $("#divMainTitle").html("${NOMBRETABLA}");
   $("#divMain").css("visibility","visible");
  });
 }  
 
 x.doBx = function(){  // Se Crean las Cajas
  x.mBx = new BoxManager('mBx');
  x.mBx.init({width: "400px"});
  x.lBx = new YW.Dialog("lBx",{  
   underlay: "shadow",  close: false,
   modal:true,          visible: false,
   fixedcenter:true
  });
  x.lBx.render();
 }
 
 x.doBtn = function(){ // Se crean los botones de control
  x.btnRef = new YW.Button("btnRef${Nombretabla}",{label:"Refrescar"}); 
  x.btnSrch = new YW.Button("btnSrch${Nombretabla}",{label:"Buscar"}); 
 }
 
  x.rDS = function(){
   var st = x.tb.getState();
   x.ds.sendRequest( ( x.tb.get("generateRequest")(st,x.tb) ),{
    success : x.tb.onDataReturnSetRows,
    failure : x.tb.onDataReturnSetRows,
	argument : st  ,
	scope : x.tb
  });
 }
  
 x.doTb = function(){
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "date" )
  var my${element.column_name} = function(lin, rec, col, dat) {
   dat = U.isDate(dat,"ddmmyyyy");
   if( !dat ) return false;
   lin.innerHTML = YU.Date.format(dat,{format: "%A, %d %B %Y"},"es");
  };
  YW.DataTable.Formatter.my${element.column_name} = my${element.column_name};  // Add the custom formatter to the shortcuts
#elseif ($element.data_type == "datetime" )  
  var my${element.column_name} = function(lin, rec, col, dat) {
   dat = U.isDatetime(dat,"ddmmyyyyhhmiss");
   if( !dat ) return false;
   lin.innerHTML = YU.Date.format(dat,{format: "%A, %d %B %Y %r"},"es");
  };
  YW.DataTable.Formatter.my${element.column_name} = my${element.column_name};  // Add the custom formatter to the shortcuts
#elseif ($element.data_type == "integer" )  
  var my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.intFormat( dat );
  };
  YW.DataTable.Formatter.my${element.column_name} = my${element.column_name};
#elseif (($element.data_type == "decimal" || $element.data_type == "int") && $element.numeric_scale == "0" )  
  var my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.intFormat( dat );
  };
  YW.DataTable.Formatter.my${element.column_name} = my${element.column_name};  
#elseif ($element.data_type == "decimal" && $element.numeric_scale != "0" )  
  var my${element.column_name} = function(lin, rec, col, dat) {
   lin.innerHTML = U.decFormat( dat );
  };
  YW.DataTable.Formatter.my${element.column_name} = my${element.column_name};    
#end
#end
#end

  var col = [ 
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar")
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, className:"css_center_th css_left_td"}
#elseif ($element.data_type == "date" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, formatter:"my${element.column_name}", className:"css_center_th css_center_td"}
#elseif ($element.data_type == "datetime" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true, formatter:"my${element.column_name}", className:"css_center_th css_center_td"}
#elseif ( $element.data_type == "decimal" || $element.data_type == "int" )
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true , formatter:"my${element.column_name}", className:"css_center_th css_right_td"}
#else
#if ( $velocityCount > 2 ) ,#else  #end {key:"${element.column_name}",label:"${element.column_name}", sortable:true , className:"css_center_tr_right_td"}
#end 
#end
#end
  ];
    
  var service = "modelController/mcDataSet.php";
  
  x.ds = YU.DataSource(service);
  x.ds.responseType = YU.DataSource.TYPE_JSON;
  x.ds.connMethodPost = true;
  x.ds.responseSchema = {
   resultsList: "records",  
   fields: [
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount == 2 ) 
#set($firstColumn = ${element.column_name})
#end 
#if ( $element.data_type == "datetime" || $element.data_type == "date" )
   #if ( $velocityCount != 1 ) ,#else  #end {key:"${element.column_name}"}   	
#else
   #if ( $velocityCount != 1 ) ,#else  #end {key:"${element.column_name}"}
#end
#end
#end
    , {key:"last_update_date"} 
   ],
   metaFields : {
    totalRecords: "totalRecords",
	paginationRecordOffset: "startIndex",
	paginationRowsPerPage: "pageSize",
	sortKey: "sort",
	sortDir: "dir",
	session_on: "session_on"
   }
  };
  

  var pgSz = 5 ;
  var sort = "${firstColumn}";
  var dir  = "desc";
  
  var tbPg = new YW.Paginator({   
   rowsPerPage: pgSz
   ,template : " {FirstPageLink} {PreviousPageLink} {PageLinks}  {NextPageLink} {LastPageLink} {CurrentPageReport} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Registros por Página:{RowsPerPageDropdown} "
   ,pageReportTemplate : "Mostrando {startRecord} - {endRecord} de {totalRecords}"
   ,rowsPerPageOptions : [5,10,15,30,40]
   ,pageLinks:10
   ,previousPageLinkLabel : "&lt; anterior"
   ,nextPageLinkLabel : "&gt; siguiente" 
   ,firstPageLinkLabel : "&lt;&lt; inicio"
   ,lastPageLinkLabel : "&gt;&gt; ultimo"
  });   
  
  var genReq = function( st, slf ){
   st = st || { pagination : null, sortedBy : null };
   sort = (st.sortedBy) ? st.sortedBy.key : sort;
   dir = (st.sortedBy) ? st.sortedBy.dir.substring(7): dir;
   var strIdx = (st.pagination) ? st.pagination.recordOffset : 0; 
   pgSz = (st.pagination) ? st.pagination.rowsPerPage : pgSz; 
   var par = [];
   var post = "'" + strIdx  + "'"
   + ",'" + pgSz + "'" 
   + ",'" + sort + "'" 
   + ",'" + dir  + "'" 
   + ",'" + U.toSQL( x.filterOne ) + "'" ;
   par.push( post );
   
   return "params=" + U.JSONstring ( par ) + 
      "&token=" + U.toURI($("#m_token").val()) +
      "&sp=" + U.toURI($("#KEY_${NOMBRETABLA}_SEL").val());
  }
  
  var cfg = {
   paginator : tbPg,
   //selectionMode : "single",
   initialLoad: true,
   generateRequest : genReq,
   initialRequest: genReq(),
   dynamicData: true,
   sortedBy:{key:sort,dir:("yui-dt-"+dir)}
  };
  
  x.tb = new YW.DataTable("tb${Nombretabla}", col, x.ds, cfg);
  
  x.tb.handleDataReturnPayload = function(rq, rp, py) {
   if ( rp.meta.session_on != "true"  ){
	U.logout();
	return false;
   }
   py.totalRecords = rp.meta.totalRecords;
   x.lBx.hide();
   return py;
  } 
	x.tb.setAttributeConfig("MSG_LOADING", { 	 
         value: "Cargando..." 
     });

	x.tb.setAttributeConfig("MSG_EMPTY", { 	 
         value: "No existen registros..." 
     });
  x.tb.subscribe("rowMouseoverEvent", x.tb.onEventHighlightRow);  
  x.tb.subscribe("rowMouseoutEvent", x.tb.onEventUnhighlightRow);
  x.tb.subscribe("rowClickEvent", x.tb.onEventSelectRow);
  x.tb.subscribe("dataReturnEvent", function(){ x.lBx.hide(); });
  /* x.tb.subscribe('cellDblclickEvent', function(ev){
   x.shwSel();
  }); */

 };
 
 x.doEv = function(){
  x.btnRef.on("click",function(){
   x.lBx.show();
   x.filterOne = "";
   ;
   x.doTb();
  });
  x.btnSrch.on("click",function(){
   x.lBx.show();
   x.filterOne = $("#i_Srch${Nombretabla}").val();
   x.doTb();
  });
 }
 
} // FIN