(() => {
  const ad = document.querySelector('.adsbygoogle');
  if (!ad) return;

  const container = ad.closest('aside');
  let previousStatus;

  function updateStatus() {
    const status = ad.getAttribute('data-ad-status');
    if (!status || status === previousStatus) return;
    previousStatus = status;
    container.hidden = status === 'unfilled';

    if (status === 'unfilled') {
      console.log('[AdSense] No ad returned (unfilled). Empty container hidden; AdSense does not report the reason here.');
    } else {
      console.log('[AdSense] Ad status:', status);
    }
  }

  const observer = new MutationObserver(updateStatus);
  observer.observe(ad, {attributes: true, attributeFilter: ['data-ad-status']});
  updateStatus();
  (window.adsbygoogle = window.adsbygoogle || []).push({});
})();
