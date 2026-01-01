export interface AirQuality {
    aqi: number;
    us_aqi?: number;
    pm2_5: number;
    pm10: number;
}

export interface WeatherResponse {
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        is_day: number;
        time: string;
    };
    current?: {
        relative_humidity_2m: number;
    };
    daily?: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        relative_humidity_2m_mean?: number[];
    };
    avgTemp30Days?: number;
    avgHumidity30Days?: number;
    humidity?: number;
    air_quality?: AirQuality;
}

export const getAirQuality = async (lat: number, lng: number): Promise<AirQuality | null> => {
    try {
        const response = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,us_aqi,pm10,pm2_5`
        );
        const data = await response.json();
        if (data.current) {
            return {
                aqi: data.current.european_aqi,
                us_aqi: data.current.us_aqi,
                pm2_5: data.current.pm2_5,
                pm10: data.current.pm10
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching air quality:", error);
        return null;
    }
};

export const getWeather = async (lat: number, lng: number): Promise<WeatherResponse | null> => {
    try {
        // Added &current=relative_humidity_2m to get live humidity
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&current=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&past_days=30&timezone=auto`
        );
        const data = await response.json();

        // Fetch Air Quality in parallel
        const airQuality = await getAirQuality(lat, lng);

        let avgTemp = data.current_weather.temperature;
        let avgHumidity = 50;

        if (data.daily) {
            // ... (keep existing daily logic) ... 
            if (data.daily.temperature_2m_max) {
                const maxs = data.daily.temperature_2m_max;
                const mins = data.daily.temperature_2m_min;
                let sum = 0, count = 0;
                for (let i = 0; i < maxs.length; i++) {
                    if (maxs[i] !== null && mins[i] !== null) {
                        sum += (maxs[i] + mins[i]) / 2;
                        count++;
                    }
                }
                if (count > 0) avgTemp = sum / count;
            }

            if (data.daily.relative_humidity_2m_mean) {
                const humidities = data.daily.relative_humidity_2m_mean;
                let hSum = 0, hCount = 0;
                for (let i = 0; i < humidities.length; i++) {
                    if (humidities[i] !== null) {
                        hSum += humidities[i];
                        hCount++;
                    }
                }
                if (hCount > 0) avgHumidity = hSum / hCount;
            }
        }

        return {
            ...data,
            avgTemp30Days: avgTemp,
            avgHumidity30Days: avgHumidity,
            // Map the fetched current humidity to the top-level property expected by UI
            humidity: data.current?.relative_humidity_2m ?? avgHumidity,
            air_quality: airQuality || undefined
        };
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
};

export const geocodeCity = async (cityName: string): Promise<{ lat: number, lng: number, name: string } | null> => {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                lat: result.latitude,
                lng: result.longitude,
                name: `${result.name}, ${result.country || ''}`
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding failed", error);
        return null;
    }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.address) {
            return data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Location";
        }
        return "Unknown Location";
    } catch (error) {
        console.error("Reverse geocoding failed", error);
        return "Unknown Location";
    }
};
