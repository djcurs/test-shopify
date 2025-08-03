import { render } from 'preact';
import { CountdownTimer } from './CountDownTimer.jsx';
import './style.css';

// Initialize Preact countdown widgets on the page
function initCountdownWidgets() {
  console.log('Initializing Preact countdown widgets...');
  
  // Find all elements with countdown widget data attributes
  const containers = document.querySelectorAll('[data-countdown-widget]');
  
  console.log(`Found ${containers.length} countdown widget containers`);
  
  containers.forEach((container, index) => {
    const shop = container.dataset.store || container.dataset.shop;
    const productId = container.dataset.productId || container.dataset.product;
    const apiUrl = container.dataset.apiUrl || container.dataset.api;
    
    console.log(`Widget ${index + 1}:`, { shop, productId, apiUrl });
    
    if (shop && productId && apiUrl) {
      // Render Preact component into the container
      render(
        <CountdownTimer 
          shop={shop}
          productId={productId} 
          apiUrl={apiUrl}
        />, 
        container
      );
      
      console.log(`Rendered countdown widget ${index + 1}`);
    } else {
      console.warn(`Missing required data attributes for widget ${index + 1}:`, {
        shop,
        productId,
        apiUrl,
        element: container
      });
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountdownWidgets);
} else {
  // DOM is already ready
  initCountdownWidgets();
}

// Expose for manual initialization (useful for dynamic content)
window.CountdownWidget = {
  init: initCountdownWidgets,
  render: render,
  CountdownTimer: CountdownTimer
};

console.log('Preact Countdown Widget loaded successfully!');