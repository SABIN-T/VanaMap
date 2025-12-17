export interface WeatherResponse {
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        is_day: number;
        time: string;
    };
    daily?: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        relative_humidity_2m_mean?: number[]; // Note: OpenMeteo might need 'hourly' for humidity or specific daily param
    };
    // Computed averages
    avgTemp30Days?: number;
}

export const getWeather = async (lat: number, lng: number): Promise<WeatherResponse | null> => {
    try {
        // Fetch current weather + daily forecast + past 30 days history
        // We use past_days=30 to get a 1-month average environment profile
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&past_days=30&timezone=auto`
        );
        const data = await response.json();

        // Calculate 30-day average temperature (Real Data from Open-Meteo)
        let avgTemp = data.current_weather.temperature;

        if (data.daily && data.daily.temperature_2m_max) {
            const maxs = data.daily.temperature_2m_max;
            const mins = data.daily.temperature_2m_min;
            let sum = 0;
            let count = 0;

            // Loop through all available days (past + forecast)
            for (let i = 0; i < maxs.length; i++) {
                if (maxs[i] !== null && mins[i] !== null) {
                    sum += (maxs[i] + mins[i]) / 2;
                    count++;
                }
            }

            if (count > 0) {
                avgTemp = sum / count;
            }
        }

        return {
            ...data,
            avgTemp30Days: avgTemp,
            // Since daily humidity isn't always available in simple view, we might estimate or keep current
            // For now, we'll map current weather code to a rough humidity baseline if not provided
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
