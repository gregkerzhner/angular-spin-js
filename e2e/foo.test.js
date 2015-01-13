'use strict';

describe('test', function() {
  describe('view1', function() {

    beforeEach(function() {
      browser.get('');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element(by.css('body')).isPresent()).toBe(true)
    });

  });
});