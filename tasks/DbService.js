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
      socket.on('message', self.handleMessage_.bind(self, socket));
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

    DbService.storage[serviceName].push(data.data);

    return {
      messageId: data.messageId,
      status: {
        code: 0
      }
    };
  },

  find: function(data) {
    var serviceName = data.serviceName;

    if (!DbService.isAuthorizedService(serviceName)) {
      throw new Error('Service not found');
    }

    var entry = DbService.storage[serviceName].filter(function(entry) {
      return data.data.id === entry.id;
    });

    return {
      data: entry,
      messageId: data.messageId,
      status: {
        code: 0
      }
    };
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

    return {
      messageId: data.messageId,
      status: {
        code: 0
      }
    };
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

    return {
      messageId: data.messageId,
      status: {
        code: 0
      }
    };
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

DbService.prototype.handleMessage_ = function(socket, data) {
  if (!DbService.isAuthorizedService(data.serviceName)) {
    socket.emit('error', 'Service not found');
  }

  console.log(data);

  var method = data._method;
  delete data._method;

  switch (method) {
    case 'POST':
      this.handleAdd_(socket, data);
      break;
    case 'DELETE':
      this.handleRemove_(socket, data);
      break;
    case 'PUT':
      this.handleUpdate_(socket, data);
      break;
    case 'GET':
      this.handleFind_(socket, data);
      break;
  }
  console.log('\n\n', DbService.storage);
};

DbService.prototype.handleAdd_ = function(socket, data) {
  try {
    socket.emit('data', DbService.storage.add(data));
  } catch (err) {
    socket.emit('error', 'Cannot add');
  }
};

DbService.prototype.handleFind_ = function(socket, data) {
  try {
    socket.emit('data', DbService.storage.find(data));
  } catch (err) {
    socket.emit('error', 'Cannot find');
  }
};

DbService.prototype.handleUpdate_ = function(socket, data) {
  try {
    socket.emit('data', DbService.storage.update(data));
  } catch (err) {
    socket.emit('error', 'Cannot update');
  }
};

DbService.prototype.handleRemove_ = function(socket, data) {
  try {
    socket.emit('data', DbService.storage.remove(data));
  } catch (err) {
    socket.emit('error', 'Cannot remove');
  }
};

module.exports = DbService;
