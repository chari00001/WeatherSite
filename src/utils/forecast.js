const req = require('postman-request')

const forecast = (lat, long, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=f0b501bdce4a5adb423eacbbb08556e9&query=" + lat + "," + long + "&units=m"
    req({url, json: true}, (error, {body}) => {
        console.log(body);
        if(error){
            callback('Unable to connect to service', undefined);
        } else if(body.error){
            callback('Unable to find location', undefined);
        } else{
            const {status, temperature,feelslike, precip, wind_speed, humidity, cloudcover} = body.current
            callback(undefined, {
                status: body.current.weather_descriptions[0],
                location: body.location.name,
                temperature,
                feelslike,
                precip,
                wind_speed,
                humidity,
                cloudcover
            })
        }
    })
}

module.exports = forecast