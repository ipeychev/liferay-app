'use strict';

var gulp = require('gulp');
var liferay = require('liferay-sdk');
var DbService = require('./DbService');

gulp.task('serve', ['build'], function() {
  var appRunner = new liferay.AppRunner();
  appRunner.run();

  setTimeout(function() {
    console.log('Bind Socket.IO');
    var app = appRunner.getApp();
    var io = require('socket.io')(app.getHttpServer());
    new DbService(io);
  }, 1000);
});
