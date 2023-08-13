function mySubmit(){
    var name = document.querySelector('.inputBox input')
    var title = document.querySelector('.inputBox select')
    var content = document.querySelector('form textarea')
    var rate= document.querySelector('.rate select')

    var data = '<div class="feedback-item"> <div class="feedback-title">'+ title.value +' ( ' + rate.value + ' sao )'+ '</div><div class="feedback-name">'+name.value+'</div><div class="feedback-content">'+ content.value+'</div></div>'
    document.querySelector('.new-feedback').innerHTML+= data
    console.log(data)
}

// this is the id of the form
$("form").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var actionUrl = form.attr('action');
    
    $.ajax({
        type: "POST",
        url: actionUrl,
        data: form.serialize(), // serializes the form's elements.
        success: function(data)
        {
            alert('Đã thêm bình luận'); // show response from the php script.
        }
    });
    
});