import React, { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { getLocationPermission } from './../../services/Permissions'
import useAllData from '../../hooks/allData'
import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import useCurrency from '../../hooks/currency'
import { AddCoordsDB } from '../../models/Location'
import { SetInfo } from '../../services/InfoStorage'
import { dropTablesDb } from '../../database'

const Loading: React.FC = () => {


    const isFocused = useIsFocused()
    const [message, setMessagee] = useState('')

    const { setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData } = useAllData()

    const { setCoords, locationData, setGeoData } = useLocation()
    const { setWeatherCoords, setWeatherData, weatherData, setDaily, setHourly } = useWeather()
    const { SetCurrencyData } = useCurrency()

    const [hasPermission, setHasPermission] = useState(false)

    function setMessage(newMessage: string) {
        // console.log(`> Loading Page => Setting new Message: ${newMessage}`)
        setMessagee(newMessage.replace('. ', '.\n'))
    }

    useEffect(() => {
        if (!isFocused || hasPermission)
            return
        //
        setMessage('Permission is necessary to continue!')
        //
        getLocationPermission().then(data => {
            setHasPermission(data)
        })
    }, [isFocused])

    async function loadData() {
        //await dropTablesDb()

        setMessage('Loading last/current location!')
        //
        let coords = await loadCoord()

        if (!coords.id || coords.id < 1)
            coords = await AddCoordsDB(coords)
        //
        if (!coords.id)
            return
        //
        await SetInfo({
            key: 'CurrentCoord',
            value: JSON.stringify(coords)
        })

        setMessage('Location read. Setting App coordinates!')

        setCoords(coords)

        setMessage('App Coordinates set. Loading Geo Location info!')

        const geoResp = await loadGeoLocation(coords.id)

        setGeoData(geoResp)

        setMessage('Geo Location set. Reading currency from location!')

        setMessage('Currency Base set. Loading currency rates!')

        const currResp = await loadCurrencyData(geoResp.currency_code)

        SetCurrencyData(currResp)

        setMessage('Currency Rates set. Starting loading weather info!')

        setWeatherCoords(coords)

        const weatherResp = await loadWeather(coords)

        setWeatherData(weatherResp)

        setMessage('Loading Daily Weather!')

        const dailyResp = await loadDailyWeather(weatherResp.id, coords)

        setDaily(dailyResp)

        setMessage('Loading Hourly Weather!')

        const hourlyResp = await loadHourlyWeather(weatherResp.id, coords)

        setHourly(hourlyResp)

        setLoading(false)

    }

    useEffect(() => {
        if (!isFocused || !hasPermission)
            return
        //
        loadData()

    }, [isFocused, hasPermission])

    return <Loader message={message} />
}

export default Loading
