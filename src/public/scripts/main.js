(function() {
  'use strict';
  /* global io,lfr */

  var dbMechanism = new lfr.HttpDbMechanism('http://localhost:3000/data/users');
  var db = new lfr.Db(dbMechanism);

  setTimeout(function() {
    console.log('Trying to update...');
    db.put({ id: 'iliyan', age: 30 });
  }, 1000);

  setTimeout(function() {
    console.log('Trying to add...');
    db.post({ id: 'maira', age: 25 });
  }, 2000);

  setTimeout(function() {
    console.log('Trying to remove...');
    db.delete({ id: 'maira' });
  }, 3000);

  setTimeout(function() {
    console.log('Trying to find...');
    db.get({ id: 'iliyan' });
  }, 4000);

  /*
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

*/

}());
