'use strict';

function DbService(io) {
  var self = this;

  var namepaces = [
    '/data/users',
    '/data/namespaces'
  ];

  namepaces.forEach(function(namespace) {
    io.of(namespace).on('connection', function(socket) {
      console.log('Client connected', namespace);
      socket.on('add', self.handleAdd_.bind(self, socket));
      socket.on('find', self.handleFind_.bind(self, socket));
      socket.on('update', self.handleUpdate_.bind(self, socket));
      socket.on('remove', self.handleRemove_.bind(self, socket));
    });
  });
}

// Static ======================================================================

DbService.storage = {
  '/data/users': [ { id: 'iliyan' }, { id: 'eduardo' } ],
  '/data/comments': [ { id: 1, content: 'Hello from Iliyan.', userId: 'iliyan' }, { id: 2, content: 'Hello from Eduardo.', userId: 'eduardo' }],

  add: function(data) {
    var serviceName = data.serviceName;

    if (!DbService.isAuthorizedService(serviceName)) {
      throw new Error('Service not found');
    }

    DbService.storage[serviceName].push(data);
  },

  find: function(data) {
    var serviceName = data.serviceName;

    if (!DbService.isAuthorizedService(serviceName)) {
      throw new Error('Service not found');
    }

    return DbService.storage[serviceName].filter(function(entry) {
      return data.id === entry.id;
    });
  },

  remove: function(data) {
    var serviceName = data.serviceName;

    if (!DbService.isAuthorizedService(serviceName)) {
      throw new Error('Service not found');
    }

    var entry = DbService.storage.find(data);
    if (entry) {
      var entryIndex = DbService.storage[serviceName].indexOf(entry);
      DbService.storage[serviceName].splice(entryIndex, 1);
    }
  },

  update: function(data) {
    var serviceName = data.serviceName;

    if (!DbService.isAuthorizedService(serviceName)) {
      throw new Error('Service not found');
    }

    var results = DbService.storage.find(data);
    if (results.length) {
      var entryIndex = DbService.storage[serviceName].indexOf(results[0]);
      DbService.storage[serviceName][entryIndex] = data;
    }
  }
};

DbService.isAuthorizedService = function(serviceName) {
  switch (serviceName) {
    case '/data/users':
    case '/data/comments':
      return true;
  }
  return false;
};

// Prototype ===================================================================

DbService.prototype.io = null;

DbService.prototype.handleAdd_ = function(socket, data) {
  if (!DbService.isAuthorizedService(data.serviceName)) {
    socket.emit('error', 'Service not found');
  }

  try {
    socket.emit('data', DbService.storage.add(data));
  } catch (err) {
    socket.emit('error', 'Cannot add');
  }

  console.log('\n\n', DbService.storage);
};

DbService.prototype.handleFind_ = function(socket, data) {
  if (!DbService.isAuthorizedService(data.serviceName)) {
    socket.emit('error', 'Service not found');
  }

  try {
    socket.emit('data', DbService.storage.find(data));
  } catch (err) {
    socket.emit('error', 'Cannot find');
  }

  console.log('\n\n', DbService.storage);
};

DbService.prototype.handleUpdate_ = function(socket, data) {
  if (!DbService.isAuthorizedService(data.serviceName)) {
    socket.emit('error', 'Service not found');
  }

  try {
    socket.emit('data', DbService.storage.update(data));
  } catch (err) {
    socket.emit('error', 'Cannot update');
  }

  console.log('\n\n', DbService.storage);
};

DbService.prototype.handleRemove_ = function(socket, data) {
  if (!DbService.isAuthorizedService(data.serviceName)) {
    socket.emit('error', 'Service not found');
  }

  try {
    socket.emit('data', DbService.storage.remove(data));
  } catch (err) {
    socket.emit('error', 'Cannot remove');
  }

  console.log('\n\n', DbService.storage);
};

module.exports = DbService;
