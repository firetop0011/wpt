// Basic test that a popup about:blank window inherits its base url from
// the initiator (which in this case is also the opener).
const runTest = (description) => {
  // In this test the opener and the initiator will be the same.
  const initiator_base_uri = document.baseURI;
  promise_test(async test => {
    const popup = window.open();
    test.add_cleanup(() => popup.close());

    // Window.open synchronously loads the initial empty document.
    assert_equals("about:blank", popup.location.href);
    assert_equals(initiator_base_uri, popup.document.baseURI);
  }, description);
};

onload = () => {
  runTest("window.open() gets base url from initiator.");
};
