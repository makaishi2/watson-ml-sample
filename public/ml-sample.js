// グローバル変数定義


function call_ml_predict( data, success, error ) {
// 決め打ちのenvironment_id,collection_id をパラメータに追加)
    Object.assign(data, {environment_id: 'system', collection_id: 'news'});
// API呼出し
    $.ajax({
        type: "GET", 
        url:  "/predict", 
        data: data,
        success: success,
        error: error
        });
}

function predict_callback(msg) {
    console.log(msg);
}    


function call_predict() {
    console.log('in predict');
    var params = [
            $('#gender').val(), 
            Number($('#age').val()),　
            $('#marital_status').val(),
            $('#profession').val()
    ];
    console.log(params);
    var data = {
        fields: ["GENDER", "AGE", "MARITAL_STATUS", "PROFESSION"],
        values: [params]
    };
    console.log(data);
    call_ml_predict( data, 
            predict_callback, 
            function(XMLHttpRequest,textStatus,errorThrown){alert('error');} );
}

