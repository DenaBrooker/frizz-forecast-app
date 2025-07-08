exports.handler = async (event, context) => {
  const { lat, lon } = event.queryStringParameters;
  
  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Latitude and longitude are required' }),
    };
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};