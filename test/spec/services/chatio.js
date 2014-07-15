'use strict';

describe('Service: chatIO', function () {

  // load the service's module
  beforeEach(module('sityooApp'));

  // instantiate service
  var chatIO;
  beforeEach(inject(function (_chatIO_) {
    chatIO = _chatIO_;
  }));

  it('should do something', function () {
    expect(!!chatIO).toBe(true);
  });

});
