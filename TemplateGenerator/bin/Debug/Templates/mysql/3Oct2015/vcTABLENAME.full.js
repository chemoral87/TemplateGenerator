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
    else _form${NOMBRETB}.refresh( getParam${NOMBRETB}() , {recordOffset: 0});
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

    /*
    var myLov = {
      dft: { pagination: { recordOffset: 0, rowsPerPage: 10 }, sortedBy: { key: "column", dir: "asc"} },
      hd: "Title",
      col: [
        { key: "column", label: "Propietario", sortable: true, className: "css_center_th css_left_td" }
      ],
      fields: [
        { key: "id" },
        { key: "column" }
      ],
      key: "KEY_DOMIC_CUENTASBANCARIAS_ALTAS_LOV",
      parameters : [_parent_id], 
      postSelect : function(data, input ){
        $(input["p_child"]).val(data["column"]);
      },
      select: [
	    { data: "id", input: "p_id" },
   	    { data: "column", input: "p_column" }
	  ],
      input_field : "p_column"
    };
    */
    
    /*    
    var myCombo =  [
      { value: "", text: "None" },
      { value: "33", text: "Alfa" },
      { value: "04", text: "Beta" }
    ];
    */
    
    /*
    var myCheck = function (lin, rec, col, dat) {
      lin.innerHTML = '<input class="check${NOMBRETB}" type="checkbox" />';
    } */
	
	/*	var myBtn = function (lin, rec, col, dat) {
        var sValue = "Boton";
        lin.innerHTML = "<span class='yui-button yui-push-button'><span class='first-child'><button type='button' >" +
        sValue + "</button></span></span>"; 
	}*/

    _form${NOMBRETB} = new FormuMgr( "form${NOMBRETB}", {
      dft : { pagination:{recordOffset:0, rowsPerPage:5}, sortedBy:{ key:"${firstColumn}", dir:"asc"}},
      /* table : {
        selectFirstRow: true,
        tfooter: {
          fixed: false,
          heading: { colspan: 2, label: "total:"},
          col_keys : [
            { key: "p_decimal", calc: '{SUM}', formatter: decFormat }
          ]
        }
      },   */
      col : [
     /* {key: "check", label: "<input id='chk${NOMBRETB}' type='checkbox' />", formatter: myCheck}, */
	 /* { key: "btn_table", label: "", formatter: myBtn } */
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && $element.column_name != "created_by" && $element.column_name != "creation_date" && $element.column_name != "last_updated_by" && $element.column_name != "last_update_date" ) 
#if ($element.data_type == "varchar" || $element.data_type == "nvarchar" )
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, className:"css_center_th css_left_td"}
#elseif ($element.data_type == "bit" )
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myBit, className:"css_center_th css_left_td"}
#elseif ($element.data_type == "date" )
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myDate, className:"css_center_th css_left_td"}
#elseif ($element.data_type == "datetime" )
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myDateTime, className:"css_center_th css_left_td"}
#elseif ( $element.data_type == "decimal" || $element.data_type == "int" || $element.data_type == "numeric" )
#if ( $element.numeric_scale == "0" ) 
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myInt, className:"css_center_th css_right_td"}
#else	  
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, formatter:myDec, className:"css_center_th css_right_td"}
#end	 
#else
      #if ( $velocityCount > 2 ) ,#else  #end{key:"${element.column_name}", label:"${element.column_title}", sortable:true, className:"css_center_tr_right_td"}
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
#elseif ( $element.data_type == "int" )
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
      parameters : getParam${NOMBRETB}(),
      labels : {
        updHeader : "Modificar ${NOMBRETABLA}",
        insHeader : "Insertar ${NOMBRETABLA}"
       //caption : "${NOMBRETABLA}"
      },
      keys : {
        selKey : "KEY_${NOMBRETABLA}_SEL",
        insKey : "KEY_${NOMBRETABLA}_INS",
        updKey : "KEY_${NOMBRETABLA}_UPD",
       //,qupdKey : "KEY_${NOMBRETABLA}_QUPD"
        delKey : "KEY_${NOMBRETABLA}_DEL"
      }
    });
    
    _form${NOMBRETB}.tb.subscribe('rowDblclickEvent', function(ev){
      _form${NOMBRETB}.update();
    });
	
	/* _form${NOMBRETB}.tb.subscribe('buttonClickEvent', function(ev){
      var column = this.getColumn(ev.target);      
      if ("btn_table" == column.key) {
	  }
	}); */

	/* _form${NOMBRETB}.tb.subscribe('rowSelectEvent', function(ev){
      var rec = this.getRecord(ev.record);
      if( id != rec.getData("id") ){
        id = rec.getData("id")
      }
    }); */
    
    /* 
    // Check / Uncheck All
    $("#chk${NOMBRETB}").change(function () {
      $(".check${NOMBRETB}").isChecked($("#chk${NOMBRETB}").isChecked());
      var recSet = _form${NOMBRETB}.tb.getRecordSet().getRecords();
      var _chk = ($("#chk${NOMBRETB}").isChecked() == 1) ? true : false;
      for (var i in recSet) {
        recSet[i].setData("check", _chk);
      }
    });
    */ 
    
    /*
    _form${NOMBRETB}.tb.subscribe("checkboxClickEvent", function (oArgs) {
      var elCheckbox = oArgs.target;
      var oRecord = this.getRecord(elCheckbox);
      oRecord.setData("check", elCheckbox.checked);
    }); */
    
  }
} // FIN