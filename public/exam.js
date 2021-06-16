
var i = 1;
var j = 1;

$(".add").click(function () {
        
        $(".qu").append(' <div class="question " id="question' + i + '"><div class="quein"><label class="label1">Q. </label><input type="text" placeholder="Question" class="que1 textbox" name="question"><input type="text" name="marks" class="que1" placeholder="Marks" size="5"><label class="label1">Marks</label><div class="addoption"><input type="radio" name="optionradio['+i+'] " value="0" class="radiobtn" ><input type="text" placeholder="Option" class="que1 textbox" name="option['+i+']"><i class="fas fa-times cancel btn"></i></div></div><input type="text" placeholder="Answer" class="que1 textbox" name="answer"><div class="lowbtn"><button type="button" class=" btn btn-dark btn-md addop " name="addbtn">Add Option</i></button><button type="button" class="del btn btn-dark btn-md" name="addbtn"><i class="far fa-trash-alt"></i></button></div></div>');
        i++;


})

$(".del").live("click ", function () {
       
        $(this).parents(".question").remove();
        
        

});

$(".addop").live("click", function () {
        var find = $(this).parent().parent().attr("id");
        
        for (let m = 0; m < i; m++) {
                if (('question'+m) == find) {


                        $(this).parents(".lowbtn").siblings(".quein").append('<div class="addoption"><input type="radio" name="optionradio['+m+']" value="0" class="radiobtn" ><input type="text" placeholder="Option" class="que1 textbox" name="option['+m+']"><i class="fas fa-times cancel btn"></i></div>')
                j++;
                }
        }

});

$(".cancel").live("click", function () {
        $(this).parents(".addoption").remove();
        j--;
       
})

$(".radiobtn").live("click",function(){
        var s=0;


        
        var b=$(this).siblings(".que1").val();
        
               
        $(this).attr('value',b);
})







