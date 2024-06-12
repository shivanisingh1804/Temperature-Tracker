# Weather Application

This is a simple weather application that fetches weather data for a given city using the OpenWeatherMap API and serves it over an HTTP server. The application is written in Go.

## Project Structure

- \`main.go\`: The main application file containing the server setup and weather querying logic.
- \`static/\`: A directory to serve static files.
- \`.apiConfig\`: A JSON file containing the API key for OpenWeatherMap.

## Prerequisites

- Go 1.16 or higher
- An API key from [OpenWeatherMap](https://openweathermap.org/api)

## Setup

1. Clone the repository:
    \`\`\`sh
    git clone https://github.com/yourusername/weather-app.git
    cd weather-app
    \`\`\`

2. Create an \`.apiConfig\` file in the root directory with the following content:
    \`\`\`json
    {
        "OpenWeatherMapApiKey": "YOUR_API_KEY_HERE"
    }
    \`\`\`

3. Build and run the application:
    \`\`\`sh
    go run main.go
    \`\`\`

4. The application will start a server on \`http://localhost:3000\`.

## Endpoints

### \`/\`

Serves static files from the \`./static\` directory.

### \`/hello\`

Returns a simple greeting message.

### \`/weather/{city}\`

Fetches and returns the weather data for the specified city in JSON format.

#### Example

Request:
\`\`\`sh
curl http://localhost:3000/weather/London
\`\`\`

Response:
\`\`\`json
{
    "name": "London",
    "main": {
        "temp": 289.92
    },
    "celsius": 16.77
}
\`\`\`

## Code Explanation

### \`apiConfigData\` Struct

Holds the API key for OpenWeatherMap.

\`\`\`go
type apiConfigData struct {
    OpenWeatherMapApiKey string \`json:"OpenWeatherMapApiKey"\`
}
\`\`\`

### \`weatherData\` Struct

Holds the weather data including the city name and temperature in both Kelvin and Celsius.

\`\`\`go
type weatherData struct {
    Name    string   \`json:"name"\`
    Main    mainData \`json:"main"\`
    Celsius float64  \`json:"celsius"\`
}

type mainData struct {
    Kelvin float64 \`json:"temp"\`
}
\`\`\`

### \`calculateCelsius\` Method

Calculates the temperature in Celsius from Kelvin.

\`\`\`go
func (wd *weatherData) calculateCelsius() {
    wd.Celsius = wd.Main.Kelvin - 273.15
}
\`\`\`

### \`loadApiConfig\` Function

Loads the API configuration from a JSON file.

\`\`\`go
func loadApiConfig(filename string) (apiConfigData, error) {
    bytes, err := ioutil.ReadFile(filename)
    if err != nil {
        return apiConfigData{}, err
    }
    var c apiConfigData
    err = json.Unmarshal(bytes, &c)
    if err != nil {
        return apiConfigData{}, err
    }
    return c, nil
}
\`\`\`

### \`hello\` Handler

A simple handler that returns a greeting message.

\`\`\`go
func hello(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("HELLO FROM SHIVANI!\\n"))
}
\`\`\`

### \`query\` Function

Fetches the weather data for a given city from OpenWeatherMap API.

\`\`\`go
func query(city string) (weatherData, error) {
    apiConfig, err := loadApiConfig(".apiConfig")
    if err != nil {
        return weatherData{}, err
    }
    resp, err := http.Get("http://api.openweathermap.org/data/2.5/weather?APPID=" + apiConfig.OpenWeatherMapApiKey + "&q=" + city)
    if err != nil {
        return weatherData{}, err
    }
    defer resp.Body.Close()
    var d weatherData
    if err := json.NewDecoder(resp.Body).Decode(&d); err != nil {
        return weatherData{}, err
    }
    d.calculateCelsius()
    return d, nil
}
\`\`\`

### \`main\` Function

Sets up the HTTP server and handlers.

\`\`\`go
func main() {
    fs := http.FileServer(http.Dir("./static"))
    http.Handle("/", fs)

    http.HandleFunc("/hello", hello)
    http.HandleFunc("/weather/", func(w http.ResponseWriter, r *http.Request) {
        city := strings.SplitN(r.URL.Path, "/", 3)[2]
        data, err := query(city)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.Header().Set("Content-Type", "application/json; charset=utf-8")
        json.NewEncoder(w).Encode(data)
    })

    http.ListenAndServe(":3000", nil)
}
\`\`\`

