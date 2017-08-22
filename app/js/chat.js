$(function() {

    var messages    = [],
        socket      = io.connect(),
        field       = $("#field"),
        content     = $("#content"),
        name        = null;

    socket.on('message', function(data) {
        if (data.message) {
            messages.push(data);

            var msgHtml = '';

            messages.forEach(function(msg) {
                msgHtml += '<b>' + (msg.username ? msg.username : 'Server') + ': </b>';
                msgHtml += msg.message + '<br />';
            });

            content.html(msgHtml);
            content[0].scrollTop = content[0].scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    $('#send').click(function() {
        if (name === null) {
            showDialogName();
        } else if (field.val() === '') {
            field.focus();
        } else {
            var text = htmlspecialchars(field.val());
            socket.emit('send', {message: text, username: name});
            field.val('').focus();
        }
    });

    var showDialogName = function() {
        $.confirm({
            title: 'Welcome!',
            theme: 'material',
            type: 'green',
            content: '' +
                '<form action="" class="formName">' +
                '   <div class="form-group">' +
                '       <label>Enter something here</label>' +
                '       <input type="text" placeholder="Your name" class="name form-control" required />' +
                '   </div>' +
                '</form>',
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-success',
                    action: function() {
                        var _name = this.$content.find('.name').val();
                        if(!_name){
                            $.alert('Provide a valid name');
                            return false;
                        }

                        name = _name;
                        var elUser = $('#user');
                        elUser.find('.name').html(name);
                        elUser.show();

                        socket.emit('hello', 'Hi <b>' + name + '</b>! 😃');
                    }
                },
                cancel: function() {
                    //close
                }
            },
            onContentReady: function() {
                this.$content.find('.name').focus();
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function(e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    };

    showDialogName();

});

function htmlspecialchars(string) {
    return $('<span>').text(string).html();
}
