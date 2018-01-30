// グローバル変数定義

function call_ml_predict( data, success, error ) {
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
    $('#pos_rate').text(msg[1]);
    $('#neg_rate').text(msg[0]);
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

