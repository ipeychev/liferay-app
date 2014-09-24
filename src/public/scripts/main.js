(function() {
  'use strict';
  /*global io*/

  var users = io('http://localhost:3000/data/users');

  setTimeout(function() {
    console.log('Trying to update...');
    users.send({ id: 'iliyan', age: 30, serviceName: users.nsp, _method: 'UPDATE' });
  }, 1000);

  setTimeout(function() {
    console.log('Trying to add...');
    users.send({ id: 'maira', age: 25, serviceName: users.nsp, _method: 'PUT' });
  }, 2000);

  setTimeout(function() {
    console.log('Trying to remove...');
    users.send({ id: 'maira', serviceName: users.nsp, _method: 'DELETE' });
  }, 3000);

  setTimeout(function() {
    console.log('Trying to find...');
    users.send({ id: 'iliyan', serviceName: users.nsp, _method: 'GET' });
  }, 4000);

  var comments = io('http://localhost:3000/data/comments');

  comments.on('data', function(data) {
    console.log('/data/comments', data);
  });

}());
