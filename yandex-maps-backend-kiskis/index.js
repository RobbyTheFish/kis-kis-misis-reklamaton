const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Вставьте ваш API ключ Яндекс Карт
const YANDEX_API_KEY = '27169ad9-423b-4580-89f6-aaf16985fc40';

// Маршрут для получения координат по адресу
app.get('/geocode', async (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
            params: {
                geocode: address,
                format: 'json',
                apikey: YANDEX_API_KEY,
            },
        });

        const geoObject = response.data.response.GeoObjectCollection.featureMember[0].GeoObject;
        const coordinates = geoObject.Point.pos.split(' ');
        res.json({
            address: geoObject.name,
            latitude: coordinates[1],
            longitude: coordinates[0],
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching geocode data' });
    }
});

// Маршрут для получения информации о месте по координатам
app.get('/reverse-geocode', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
            params: {
                geocode: `${lon},${lat}`,
                format: 'json',
                kind: 'house',
                apikey: YANDEX_API_KEY,
            },
        });

        const geoObject = response.data.response.GeoObjectCollection.featureMember[0].GeoObject;
        res.json({
            address: geoObject.name,
            description: geoObject.description,
            metaData: geoObject.metaDataProperty.GeocoderMetaData,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reverse geocode data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
