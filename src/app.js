// Importing packs
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 8080

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and paths
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve 
app.use(express.static(publicDirectoryPath))

// Setting up routes
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Chari'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Chari'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        help: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus, tempore! Accusamus, odit assumenda! Ratione dicta fugit repudiandae dolore atque dolorum hic, facere ex tenetur libero maxime aut, architecto beatae odit.',
        title: 'Help',
        name: 'Chari'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Please provide an address to search'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error,
            })
        } 
        forecast(latitude, longitude, (error, {status, temperature, feelslike, precip, wind_speed, humidity, cloudcover} = {}) => {
            if(error){
                return res.send({
                    error,
                })
            }
            res.send({
                location,
                forecast: status + ". It is currently " + temperature + " degrees out. There is a " + precip + "% chance of rain, " + wind_speed + " km/h of wind speed, " + humidity + "% of humidity and " + cloudcover + "% cloudcover. "
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'Please provide a search term'
        })
    }

    console.log(req.query.search);

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Unknown Article',
        msg: 'Article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Page not found.'
    })
})

// Server start
app.listen(port, () => {
    console.log('Server is up on port ' + port + '.');
})