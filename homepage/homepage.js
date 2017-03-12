function codeSubmit(){
    if($('#codeInput').val()==''){
        return
    }else{
        $('#codeInput').val('');
        $('#submitText').html('itsmymoneyandiwantitnow');
        $('#code').css("visibility","visible");
    }
}