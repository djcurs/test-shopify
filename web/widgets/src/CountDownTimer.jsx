import { useState, useEffect } from 'preact/hooks';

export function CountdownTimer({ shop, productId, apiUrl }) {
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const fetchTimers = async () => {
      try {
        console.log('Fetching timers for:', { shop, productId, apiUrl });
        
        const response = await fetch(`${apiUrl}/api/public/timers/active?shop=${shop}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allTimers = await response.json();
        console.log('All timers from API:', allTimers);
        
        const productTimers = allTimers.filter(timer => 
          timer.productIds.includes(productId) || timer.productIds.length === 0
        );
        
        console.log('Filtered timers for product:', productTimers);
        setTimers(productTimers);
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching timers:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (shop && apiUrl) {
      fetchTimers();
    }
  }, [shop, productId, apiUrl]);

  useEffect(() => {
    if (timers.length === 0) return;

    const interval = setInterval(() => {
      const newTimeLeft = {};
      
      timers.forEach(timer => {
        if (timer.endTime) {
          const now = new Date().getTime();
          const end = new Date(timer.endTime).getTime();
          const difference = end - now;
          
          if (difference > 0) {
            newTimeLeft[timer.id] = {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
          } else {
            newTimeLeft[timer.id] = null; 
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  const isUrgent = (timer) => {
    const time = timeLeft[timer.id];
    if (!time) return false;
    
    const totalMinutes = time.hours * 60 + time.minutes;
    return totalMinutes < 5;
  };

  if (loading) {
    return (
      <div className="countdown-loading">
        <p>Loading countdown timer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="countdown-error">
        <p>Error loading timer: {error}</p>
      </div>
    );
  }

  if (timers.length === 0) {
    return null; 
  }

  return (
    <div className="countdown-container">
      {timers.map(timer => {
        const time = timeLeft[timer.id];
        const expired = time === null && timer.endTime;
        const urgent = isUrgent(timer);

        if (expired && timer.hideAfterCompletion) {
          return null;
        }

        return (
          <div 
            key={timer.id} 
            className={`countdown-timer ${urgent ? 'urgent' : ''} ${expired ? 'expired' : ''}`}
            style={{
              background: timer.style?.backgroundColor,
              color: timer.style?.textColor,
              borderRadius: timer.style?.borderRadius ? `${timer.style.borderRadius}px` : undefined,
              fontFamily: timer.style?.fontFamily,
              fontSize: timer.style?.fontSize ? `${timer.style.fontSize}px` : undefined,
              padding: timer.style?.padding ? `${timer.style.padding}px` : undefined,
              ...(urgent && timer.urgencySettings?.pulseColor ? { '--pulse-color': timer.urgencySettings.pulseColor } : {}),
            }}
          >
            {timer.beforeMessage && !expired && (
              <h3 className="countdown-title">{timer.beforeMessage}</h3>
            )}
            
            {expired ? (
              <div className="countdown-expired">
                {timer.afterMessage || 'Offer has ended!'}
              </div>
            ) : time ? (
              <div className="countdown-display">
                {time.days > 0 && (
                  <div className="countdown-unit">
                    <span className="countdown-number">{time.days}</span>
                    <span className="countdown-label">Days</span>
                  </div>
                )}
                <div className="countdown-unit">
                  <span className="countdown-number">{time.hours}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-number">{time.minutes}</span>
                  <span className="countdown-label">Minutes</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-number">{time.seconds}</span>
                  <span className="countdown-label">Seconds</span>
                </div>
              </div>
            ) : (
              <div className="countdown-ongoing">
                Ongoing promotion!
              </div>
            )}
            
            {urgent && !expired && timer.urgencySettings?.showBanner && (
              <div 
                className={"countdown-urgency pulse"}
                style={{ 
                  backgroundColor: timer.urgencySettings?.pulseColor || '#ff0000',
                  '--pulse-color': timer.urgencySettings?.pulseColor || '#ff0000',
                }}
              >
                {timer.urgencySettings?.bannerMessage || 'Hurry! Only minutes left!'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}