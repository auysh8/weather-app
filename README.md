# Weather App

A simple weather application built with React, Vite, and TypeScript.

## How to Run This Project Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/auysh8/weather-app.git](https://github.com/auysh8/weather-app.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd weather-app
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Get your API Key:**
    This project requires an API key from OpenWeatherMap. You can get a free one here: [https://openweathermap.org/api](https://openweathermap.org/api)

5.  **Create your environment file:**
    Copy the example file to create your own local `.env` file.
    ```bash
    cp .env.example .env
    ```
    *(Or, you can just create a new file named `.env` manually)*

6.  **Add your API key:**
    Open the new `.env` file and paste in your API key. It should look like this:
    `VITE_OPENWEATHER_API_KEY="paste_your_new_key_here"`

7.  **Run the app:**
    ```bash
    npm run dev
    ```