const FrizzForecastApp = () => {
  const [humidity, setHumidity] = useState(null);
  const [location, setLocation] = useState('Loading...');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Your API key
  const API_KEY = '7a63edbcd3959499ac052fbbb8c7e3d5';

  // Get user's location and fetch weather
  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location access to show your local humidity.');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get city name
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const cityName = `${geocode[0].city}, ${geocode[0].region}`;
      setLocation(cityName);

      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      
      setHumidity(weatherData.main.humidity);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not get weather data. Please try again.');
      setLoading(false);
    }
  };

  const getFrizzLevel = (humidity) => {
    if (humidity <= 30) return { level: 'Low', color: '#10B981' };
    if (humidity <= 50) return { level: 'Medium', color: '#F59E0B' };
    if (humidity <= 70) return { level: 'High', color: '#F97316' };
    return { level: 'Very High', color: '#EF4444' };
  };

  const getCurrentTip = () => {
    if (!humidity) return "Loading weather data...";
    
    const frizzLevel = getFrizzLevel(humidity);
    
    const tips = {
      'Low': 'Perfect day for heat styling! Your hair will hold styles longer in low humidity. ☀️',
      'Medium': 'Use a light leave-in conditioner to maintain moisture balance. 🌤️',
      'High': 'Apply anti-frizz serum before styling and avoid touching your hair. 🌧️',
      'Very High': 'Embrace protective styles! Braids and buns are your best friends today. ⛈️'
    };
    
    return tips[frizzLevel.level];
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your frizz forecast...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Frizz Forecast</Text>
        <Text style={styles.location}>📍 {location}</Text>
      </View>

      {/* Humidity Display */}
      <View style={styles.humidityCard}>
        <Text style={styles.cardTitle}>Current Humidity</Text>
        <Text style={styles.humidityText}>{humidity}%</Text>
        
        {/* Frizz Level */}
        <View style={styles.frizzIndicator}>
          <Text style={styles.frizzEmoji}>😌</Text>
          <View style={styles.slider}>
            <View style={styles.sliderTrack} />
            <View style={[styles.sliderThumb, { left: `${humidity}%` }]} />
          </View>
          <Text style={styles.frizzEmoji}>😫</Text>
        </View>
        
        <Text style={[styles.frizzLevel, { color: getFrizzLevel(humidity).color }]}>
          Frizz Level: {getFrizzLevel(humidity).level}
        </Text>
      </View>

      {/* Today's Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Today's Hair Tip</Text>
        <Text style={styles.tipText}>{getCurrentTip()}</Text>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={getLocationAndWeather}>
        <Text style={styles.refreshText}>🔄 Refresh Weather</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#EC4899',
    padding: 40,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  humidityCard: {
    backgroundColor: '#FCE7F3',
    margin: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  humidityText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  frizzIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  frizzEmoji: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  frizzLevel: {
    fontSize: 18,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#F3E8FF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: '#EC4899',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    color: '#EC4899',
  },
});

export default FrizzForecastApp;
