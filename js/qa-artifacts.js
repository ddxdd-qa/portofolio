(() => {
  function initArtifactTabs() {
    const tabs = document.querySelectorAll('.qa-artifact-tab');
    const panels = document.querySelectorAll('.qa-artifact-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArtifactTabs);
  } else {
    initArtifactTabs();
  }
})();
