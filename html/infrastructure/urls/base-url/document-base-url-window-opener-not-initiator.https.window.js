// Tests that a popup about:blank window inherits its base url from
// the initiator, and not the opener.
var popup;

const runTest = (description) => {
  const opener_base_uri = document.baseURI;

  promise_test((test) => {
    return new Promise(async resolve => {
      popup = window.open();
      test.add_cleanup(() => popup.close());
      assert_equals(popup.location.href, 'about:blank');

      // Create iframe to be the initiator.
      const iframe = document.createElement('iframe');
      iframe.srcdoc = `
      <head>
      <base href='https://example.com'>
      <script>
        window.top.popup.location.href = 'about:blank';
      </scr` +
          `ipt>
      </head>
      <body></body>
      `;

      popup.addEventListener("load", resolve);
      document.body.append(iframe);
      setTimeout(() => {
        resolve(); // This is necessary, or else the test times out. That
                   // suggests that there's no load event for the about:blank
                   // navigation?
                   // But the load *does* take time, so we stick it inside a
                   // timeout to delay long enough for the test to work.
      }, 1000);
    }).then(() => {
      assert_equals('https://example.com/', popup.document.baseURI);
    });
  }, description);
};

onload = () => {
  runTest("window.open() gets base url from initiator not opener.");
};
