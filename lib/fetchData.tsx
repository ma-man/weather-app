import { addDays, format} from 'date-fns'

export async function fetchWeatherData() {

    class weatherData {
        temData: number[] = []
        humidityData: number[] = []
        rainData: number[] = []
        dataTime: string[] = []

        getMaxMin(humidity:[]): Promise<any> {

            const dewMaxMin: number[] = 
            [
                Math.max(...humidity),
                Math.min(...humidity)
            ]
            return Promise.resolve(dewMaxMin)
        }
    }

    const weather = new weatherData

    const { date } = returnIsoDate()

    const search = `https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=temperature_2m&hourly=relativehumidity_2m&hourly=rain&start_date=${date[0]}&end_date=${date[1]}`

    const res = await fetch(search)
    const json = await res.json()
    const newHumidity = await weather.getMaxMin(json.hourly.relativehumidity_2m)

    weather.temData = json.hourly.temperature_2m
    weather.humidityData = newHumidity
    weather.rainData = json.hourly.rain
    weather.dataTime = json.hourly.time

    return{
        temData: weather.temData,
        humidityData: weather.humidityData,
        rainData: weather.rainData,
        dataTime: weather.dataTime
    }
}

export function returnIsoDate () {
    const date = new Date()
    const startDate = format(date, 'yyyy-MM-dd')
    const endDate = format(addDays(date, 1), 'yyyy-MM-dd')

    return{
        date: [
            startDate,
            endDate
        ],
    }
}

