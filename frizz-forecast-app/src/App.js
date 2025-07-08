import React, { useState, useEffect } from 'react';

// Lucide React icons (using CDN for simplicity)
const TrendingUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
    <polyline points="16,7 22,7 22,13"></polyline>
  </svg>
);

const TrendingDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,17 13.5,8.5 8.5,13.5 2,7"></polyline>
    <polyline points="16,17 22,17 22,11"></polyline>
  </svg>
);

const Droplets = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2.26 4.89 4.56 6.01a10.97 10.97 0 0 0 .01 1.37c0 5.18-2.51 8.61-6.8 7.83"></path>
  </svg>
);

const Calendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Lightbulb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21h6"></path>
    <path d="M12 3C8.5 3 6 5.5 6 9c0 1 0 3 2 5 1 1 1 1 1 2h6c0-1 0-1 1-2 2-2 2-4 2-5 0-3.5-2.5-6-6-6z"></path>
  </svg>
);

const MapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const RefreshCw = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M3 21v-5h5"></path>
  </svg>
);

const HairFrizzApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('Getting location...');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const getFrizzLevel = (humidity) => {
    if (humidity < 30) return { level: 'Very Low', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' };
    if (humidity < 50) return { level: 'Low', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (humidity < 70) return { level: 'Moderate', color: 'text-pink-600', bg: 'bg-pink-50' };
    if (humidity < 85) return { level: 'High', color: 'text-fuchsia-700', bg: 'bg-fuchsia-100' };
    return { level: 'Very High', color: 'text-purple-700', bg: 'bg-purple-100' };
  };

  const getArrowDirection = (humidity) => {
    return humidity > 50 ? 'up' : 'down';
  };

  const stylingTips = {
    low: [
      "Perfect day for sleek styles! Try a flat iron for smooth results.",
      "Use a light leave-in conditioner to add moisture without weight.",
      "Great time for air-drying with minimal product.",
      "Consider a silk scarf or pillowcase to maintain smoothness."
    ],
    moderate: [
      "Apply anti-frizz serum before styling.",
      "Use a diffuser when blow-drying to maintain curl pattern.",
      "Try the 'plopping' method for curly hair.",
      "Braid damp hair for natural waves."
    ],
    high: [
      "Deep condition the night before high humidity days.",
      "Use a strong-hold gel or cream to lock in moisture.",
      "Embrace protective styles like buns or braids.",
      "Apply a humidity-blocking spray as your final step.",
      "Consider a silk or satin hair wrap overnight."
    ]
  };

  const getCurrentTips = (humidity) => {
    if (humidity < 50) return stylingTips.low;
    if (humidity < 70) return stylingTips.moderate;
    return stylingTips.high;
  };

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(`/.netlify/functions/current-weather?lat=${lat}&lon=${lon}`);
      const currentData = await currentResponse.json();
      
      // Fetch forecast
      const forecastResponse = await fetch(`/.netlify/functions/forecast-weather?lat=${lat}&lon=${lon}`);
      const forecastData = await forecastResponse.json();
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      setWeatherData({
        current: currentData,
        forecast: forecastData
      });
      setLocation(`${currentData.name}, ${currentData.sys.country}`);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          setError('Unable to get your location. Please enable location services.');
          // Fallback to a default location (San Francisco)
          fetchWeatherData(37.7749, -122.4194);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      // Fallback to a default location
      fetchWeatherData(37.7749, -122.4194);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleRefresh = () => {
    getUserLocation();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const currentHumidity = weatherData.current.main.humidity;

  const HomeScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <MapPin className="w-4 h-4 text-fuchsia-600" />
          <span className="text-sm">{location}</span>
        </div>
        <p className="text-xs text-gray-600">
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      </div>

      {/* Main Humidity Display */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="text-6xl font-bold text-fuchsia-600">
            {currentHumidity}%
          </div>
          <div className="absolute -top-2 -right-8">
            {getArrowDirection(currentHumidity) === 'up' ? (
              <TrendingUp className="w-8 h-8 text-purple-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-pink-600" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className={`inline-block px-4 py-2 rounded-full ${getFrizzLevel(currentHumidity).bg}`}>
            <span className={`font-semibold ${getFrizzLevel(currentHumidity).color}`}>
              {getFrizzLevel(currentHumidity).level} Frizz Risk
            </span>
          </div>
          <p className="text-sm text-gray-800">
            {currentHumidity > 50 ? 'High humidity = More frizz potential' : 'Low humidity = Less frizz potential'}
          </p>
        </div>
      </div>

      {/* Frizz Meter */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-800">
          <span>Less Frizz</span>
          <span>More Frizz</span>
        </div>
        <div className="relative h-3 bg-gradient-to-r from-pink-200 via-purple-200 to-fuchsia-200 rounded-full">
          <div 
            className="absolute top-0 w-3 h-3 bg-fuchsia-600 rounded-full border-2 border-white shadow-md transition-all duration-300"
            style={{ left: `${currentHumidity}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-700">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white rounded-lg p-4 space-y-3 border border-purple-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-fuchsia-600" />
          Today's Hair Tips
        </h3>
        <ul className="space-y-1 text-sm text-gray-800">
          {getCurrentTips(currentHumidity).slice(0, 2).map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-fuchsia-700 transition-colors disabled:opacity-50"
      >
        <RefreshCw className="w-4 h-4" />
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  );

  const ForecastScreen = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">7-Day Frizz Forecast</h2>
      
      <div className="space-y-3">
        {weatherData.forecast.list.slice(0, 7).map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const humidity = day.main.humidity;
          
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{dayName}</div>
                <div className="text-sm text-gray-700">{day.weather[0].description}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-fuchsia-600">{humidity}%</div>
                  <div className="text-xs text-gray-600">Humidity</div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFrizzLevel(humidity).bg} ${getFrizzLevel(humidity).color}`}>
                  {getFrizzLevel(humidity).level}
                </div>
                
                <div className="text-gray-700">
                  {humidity > 50 ? (
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-pink-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-gray-900 mb-2">This Week's Planning</h3>
        <p className="text-sm text-gray-800">
          Plan your hair routine based on the humidity forecast above. Lower humidity days are perfect for sleek styles!
        </p>
      </div>
    </div>
  );

  const StylingTipsScreen = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Styling Tips</h2>
      
      <div className="space-y-6">
        {/* Low Humidity Tips */}
        <div className="bg-white rounded-lg p-4 border border-pink-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-pink-600" />
            Low Humidity Days (0-50%)
          </h3>
          <ul className="space-y-2 text-sm text-gray-800">
            {stylingTips.low.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-pink-600 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Moderate Humidity Tips */}
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-purple-600" />
            Moderate Humidity Days (50-70%)
          </h3>
          <ul className="space-y-2 text-sm text-gray-800">
            {stylingTips.moderate.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* High Humidity Tips */}
        <div className="bg-white rounded-lg p-4 border border-fuchsia-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-fuchsia-600" />
            High Humidity Days (70%+)
          </h3>
          <ul className="space-y-2 text-sm text-gray-800">
            {stylingTips.high.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-fuchsia-600 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
        <p className="text-sm text-gray-800">
          Keep a small bottle of leave-in conditioner and a silk hair tie in your bag for unexpected humidity spikes during the day!
        </p>
      </div>
    </div>
  );

  const screens = {
    home: HomeScreen,
    forecast: ForecastScreen,
    tips: StylingTipsScreen
  };

  const CurrentScreen = screens[currentScreen];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-fuchsia-600 shadow-sm px-4 py-3">
        <h1 className="text-lg font-bold text-white text-center">
          Frizz Forecast
        </h1>
      </div>

      {/* Content */}
      <div className="p-4">
        <CurrentScreen />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-purple-200">
        <div className="flex">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex-1 py-3 px-4 text-center ${currentScreen === 'home' ? 'text-fuchsia-600 border-t-2 border-fuchsia-600' : 'text-gray-600'}`}
          >
            <Droplets className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Current</span>
          </button>
          <button
            onClick={() => setCurrentScreen('forecast')}
            className={`flex-1 py-3 px-4 text-center ${currentScreen === 'forecast' ? 'text-fuchsia-600 border-t-2 border-fuchsia-600' : 'text-gray-600'}`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Forecast</span>
          </button>
          <button
            onClick={() => setCurrentScreen('tips')}
            className={`flex-1 py-3 px-4 text-center ${currentScreen === 'tips' ? 'text-fuchsia-600 border-t-2 border-fuchsia-600' : 'text-gray-600'}`}
          >
            <Lightbulb className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Tips</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HairFrizzApp;