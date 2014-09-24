(function() {
  'use strict';
  /*global io*/

  var users = io('http://localhost:3000/data/users');

  setTimeout(function() {
    console.log('Trying to update...');
    users.emit('update', { id: 'iliyan', age: 30, serviceName: users.nsp });
  }, 1000);

  setTimeout(function() {
    console.log('Trying to add...');
    users.emit('add', { id: 'maira', age: 25, serviceName: users.nsp });
  }, 2000);

  setTimeout(function() {
    console.log('Trying to remove...');
    users.emit('remove', { id: 'maira', serviceName: users.nsp });
  }, 3000);

  setTimeout(function() {
    console.log('Trying to find...');
    users.emit('find', { id: 'iliyan', serviceName: users.nsp });
  }, 4000);

  var comments = io('http://localhost:3000/data/comments');

  comments.on('data', function(data) {
    console.log('/data/comments', data);
  });

}());
