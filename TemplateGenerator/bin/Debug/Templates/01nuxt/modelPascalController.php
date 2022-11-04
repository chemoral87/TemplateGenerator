${NOMBRETB}
${NOMBRETABLA}
${modelPascal}
${modelKebab}
${model}

// App\Http\\${modelPascal}Controller.php
use App\Models\\${modelPascal};
use Illuminate\Http\Request;

  public function index(Request $request) {
    $query = queryServerSide($request, new ${modelPascal}());
    $${nombretabla} = $query->paginate($request->get('itemsPerPage'));
    return new DataSetResource($${nombretabla});
  }
  
  public function create(Request $request) {
    $${model} = ${modelPascal}::create($request->all());
    return ['success' => __('messa.${model}_create')];
  }

#set($myValues = ["created_at", "updated_at"])
  public function update(Request $request, $id) {
    $${model} = ${modelPascal}::where("id", $id)->update([
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && !$myValues.contains($element.column_name)) 
    '${element.column_name}' => $request->get('${element.column_name}'),
#end
#end
    ]);
    return [
      'success' => __('messa.${model}_update'),
    ];
  }
  
  public function delete($id) {
    ${modelPascal}::find($id)->delete();
    return ['success' => __('messa.${model}_delete')];
  }
  
  public function show(Request $request, $id) {
    $${model} = ${modelPascal}::where("id", $id)->first();

    if ($${model} == null) {
      abort(405, '${modelPascal} not found');
    }
    return response()->json($${model});
  }
  
  
  // messa.php
  '${model}_create' => '${modelPascal} creado',
  '${model}_update' => '${modelPascal} guardado',
  '${model}_delete' => '${modelPascal} eliminado',
  
  // api.php
   Route::group(["prefix" => "${modelKebab}"], function () {
        $controller = "${modelPascal}Controller";
        Route::get("/", "{$controller}@index");
        Route::get("/{id}", "{$controller}@show");
        Route::post("/", "{$controller}@create");
        Route::put("/{id}", "{$controller}@update");
        Route::delete("/{id}", "{$controller}@delete");
    });
	
  // App\Models\\${modelPascal}.php
  
  protected $fillable = [
#set($myValues = ["created_at", "updated_at"])
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && !$myValues.contains($element.column_name)) 
    "${element.column_name}",
#end
#end
  ];