'use strict';

define(['app'], function (app) {

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    var chatController = function ($scope) {

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];

        $scope.socks = function () {
            var socket = io.connect('http://localhost:8080');

            // on connection to server, ask for user's name with an anonymous callback
            socket.on('connect', function () {
                // call the server-side function 'adduser' and send one parameter (value of prompt)
                socket.emit('adduser', getCookie("name"));
            });

            // listener, whenever the server emits 'updatechat', this updates the chat body
            socket.on('updatechat', function (username, data) {
                $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
            });

            // listener, whenever the server emits 'updateusers', this updates the username list
            socket.on('updateusers', function (data) {
                $('#users').empty();
                $.each(data, function (key, value) {
                    $('#users').append('<div>' + key + '</div>');
                });
            });

            // on load of page
            $(function () {
                // when the client clicks SEND
                $('#datasend').click(function () {
                    var message = $('#data').val();
                    $('#data').val('');
                    // tell server to execute 'sendchat' and send along one parameter
                    socket.emit('sendchat', message);
                });

                // when the client hits ENTER on their keyboard
                $('#data').keypress(function (e) {
                    if (e.which == 13) {
                        $(this).blur();
                        $('#datasend').focus().click();
                    }
                });
            });
        };


    };
    app.register.controller('chatController', ['$scope', chatController]);

});