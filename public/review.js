$(".mainpage").click(function(){
    $(".mainpage").css("color","blue");
})

$(".star").live("click",function(){
    $(this).attr("class","fas fa-star fa-3x gstar")
    
    
    
    var a=$(this).attr("value");
    $(this).parents(".displaystar").siblings(".sbtn").attr("value",a);
    var b=$(this).parents(".review").siblings(".sbtn").val();
    
    for(let i=a;i>0;i--){
        var temp=i;
        
        
        $(this).siblings("#"+i).attr("class","fas fa-star fa-3x gstar star");
    }
   
})