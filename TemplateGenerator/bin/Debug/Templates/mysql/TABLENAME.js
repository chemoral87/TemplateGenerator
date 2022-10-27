#set ( $ajax = '$.ajax' )
function ${NOMBRETABLA}(){
  /* table defaul values */
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount == 2 ) 
#set($firstColumn = ${element.column_name})
#end 
#end
#end 
  var _form${NOMBRETB} ;
  
  this.run = function(){  
    $("#divMainTitle").html("${Nombretabla}");
    $("#divMain").show();
    doBtn();
    search${NOMBRETB}();
    doEv();
  }  
  
  function doEv(){
    $(".p_search${NOMBRETB}").keypress(function (e) {
      if (U.keyEnter(e)) {
        search${NOMBRETB}();
      }
    });
  }
  
  function doBtn(){ // Se crean los botones de control
    var _btnIns${NOMBRETB} = new YW.Button("btnIns${NOMBRETB}",{label:"Nuevo"});
    _btnIns${NOMBRETB}.on("click",function(){
      _form${NOMBRETB}.insert();
    });
  
    var _btnUpd${NOMBRETB} = new YW.Button("btnUpd${NOMBRETB}",{label:"Editar"});
    _btnUpd${NOMBRETB}.on("click",function(){
      _form${NOMBRETB}.update();
    });
  
    var _btnDel${NOMBRETB} = new YW.Button("btnDel${NOMBRETB}",{label:"Eliminar"});
    _btnDel${NOMBRETB}.on("click",function(){
      _form${NOMBRETB}.delete();
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
  
  function getParam${NOMBRETB}(){
    var parameters = [];
    parameters.push( $("#i_Srch${NOMBRETB}").val() );
    return parameters;
  }
  
  function search${NOMBRETB}(){
    if( _form${NOMBRETB} == null ) doForm${NOMBRETB}();
    else _form${NOMBRETB}.refresh( getParam${NOMBRETB} , {recordOffset: 0});
  }
  
  function doForm${NOMBRETB}(){
    var myBit = function(lin, rec, col, dat) {
      lin.innerHTML = (dat == "1")? "Si" : ( dat == "0")? "No" : dat;
    };
	var myDate = function(lin, rec, col, dat) {
      lin.innerHTML = U.dateFormat(dat,"%d %b %Y"); 
    }
	var myDateTime = function(lin, rec, col, dat) {
      lin.innerHTML = U.dateFormat(dat,"%d %b %Y %r");
    }
	var myInt = function(lin, rec, col, dat) {
      lin.innerHTML = U.intFormat( dat );
    };
	var myDec = function(lin, rec, col, dat) {
      lin.innerHTML = U.decFormat( dat );
    };   	

    _form${NOMBRETB} = new FormuMgr( "form${NOMBRETB}", {
      dft : { pagination:{recordOffset:0, rowsPerPage:5}, sortedBy:{ key:"${firstColumn}", dir:"asc"}},
      col : [
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, className:"css_center_th css_left_td"},
#elseif ($element.data_type == "bit" )
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myBit, className:"css_center_th css_left_td"},
#elseif ($element.data_type == "date" )
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myDate, className:"css_center_th css_left_td"},
#elseif ($element.data_type == "datetime" )
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myDateTime, className:"css_center_th css_left_td"},
#elseif ( $element.data_type == "decimal" || $element.data_type == "int" || $element.data_type == "smallint" || $element.data_type == "tinyint" || $element.data_type == "mediumint" || $element.data_type == "numeric" )
#if ( $element.numeric_scale == "0" ) 
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myInt, className:"css_center_th css_right_td"},
#else	  
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myDec, className:"css_center_th css_right_td"},
#end	  
#else
      {key:"${element.column_name}", label:"${element.column_title}", sortable:true, className:"css_center_tr_right_td"},
#end 
#end
#end
      ],
      paginator : {
        position : "bottom" // "top", null  
       //,rowsPerPageOptions : [5,6,7]
       //,template : U.pgtTmplXLS
      },
      fields : [
#foreach ( $element in $DataModel.Rows)
#if( $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ( $velocityCount == 2 ) 
#set($firstColumn = ${element.column_name})
#end
#if ( $element.column_key == "PRI" )
        {key: "${element.column_name}", updatable: "hidden", deletable: true },
#elseif ( $element.data_type == "date" )
        {key:"${element.column_name}", label: "${element.column_title}", type:"date", insertable: true, updatable: true #if( $element.is_nullable == "NO") ,nullable: false #else #end},
#elseif ( $element.data_type == "datetime" )
        {key:"${element.column_name}", label: "${element.column_title}", type:"datetime", insertable: true, updatable: true #if( $element.is_nullable == "NO") ,nullable: false #else #end},
#elseif ( $element.data_type == "int" || $element.data_type == "smallint" || $element.data_type == "tinyint" || $element.data_type == "mediumint" )
        {key:"${element.column_name}", label: "${element.column_title}", type:"integer", insertable: true, updatable: true, parser:"number" #if( $element.is_nullable == "NO") ,nullable: false #else #end},
#elseif ( $element.data_type == "numeric" || $element.data_type == "decimal" )
        {key:"${element.column_name}", label: "${element.column_title}", type:"decimal", insertable: true, updatable: true, mDec:${element.numeric_scale}, vMax: (Math.pow(10,(${element.numeric_precision}-${element.numeric_scale})) - (1 / Math.pow(10,${element.numeric_scale}))), parser:"number" #if( $element.is_nullable == "NO") ,nullable: false #else #end},
#elseif ( $element.data_type == "varchar" || $element.data_type == "nvarchar" ) 
        {key:"${element.column_name}", label: "${element.column_title}", type:"varchar", insertable: true, updatable: true,  maxlength: ${element.character_maximum_length} #if( $element.is_nullable == "NO") ,nullable: false #else #end},
#elseif ( $element.data_type == "bit" ) 
        {key:"${element.column_name}", label: "${element.column_title}", type:"bit", insertable: true, updatable: true },
#end
#end
#end
        {key:"last_update_date", updatable:"hidden", deletable: true} 
      ],
      parameters : getParam${NOMBRETB},
      labels : {
        updHeader : "Modificar ${NOMBRETABLA}"
       ,insHeader : "Insertar ${NOMBRETABLA}"
       //,caption : "${NOMBRETABLA}"
      },
      keys : {
        selKey : "KEY_${NOMBRETABLA}_SEL"
       ,insKey : "KEY_${NOMBRETABLA}_INS"
       ,updKey : "KEY_${NOMBRETABLA}_UPD"
       ,delKey : "KEY_${NOMBRETABLA}_DEL"
      }
    });
    
    _form${NOMBRETB}.tb.subscribe('rowDblclickEvent', function(ev){
      _form${NOMBRETB}.update();
    });
	/*
	_form${NOMBRETB}.tb.subscribe('rowSelectEvent', function(ev){
      var rec = this.getRecord(ev.record);
      if( id != rec.getData("id") ){
        id = rec.getData("id");
      }
    });*/
  }
} // FIN