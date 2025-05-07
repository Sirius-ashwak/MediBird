// Use vanilla JavaScript instead of React components for a minimal test
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background-color: #f9fafb;">
        <div style="background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 28rem; width: 100%;">
          <h1 style="font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 1.5rem;">MediBridge</h1>
          <p style="color: #4b5563; margin-bottom: 1rem;">
            A decentralized AI-powered healthcare system powered by Polkadot blockchain.
          </p>
          <div style="padding: 1rem; background-color: #eff6ff; border-radius: 0.375rem;">
            <p>The application is loading...</p>
            <p id="status">Checking connection...</p>
          </div>
        </div>
      </div>
    `;

    // Simple API call to test server connectivity
    fetch('/api/health')
      .then(response => {
        const statusEl = document.getElementById('status');
        if (statusEl) {
          if (response.ok) {
            statusEl.textContent = 'Connected to server successfully!';
            statusEl.style.color = 'green';
          } else {
            statusEl.textContent = `Server responded with status: ${response.status}`;
            statusEl.style.color = 'orange';
          }
        }
      })
      .catch(error => {
        const statusEl = document.getElementById('status');
        if (statusEl) {
          statusEl.textContent = `Connection error: ${error.message}`;
          statusEl.style.color = 'red';
        }
      });
  }
});
