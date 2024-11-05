const { Client } = require('pg');
const wkx = require('wkx');

const client = new Client({
    host: 'localhost',       // Database host
    port: 5432,              // PostgreSQL poort
    user: 'postgres',   // Database gebruiker
    password: 'postgres', // Database wachtwoord
    database: 'postgres'    // Database naam
});

async function fetchGeometry() {
    try {
        // Verbinding maken met de database
        await client.connect();

        const res = await client.query("SELECT ST_AsBinary(geom) as geom from hectopunten_instances h LIMIT 1");
        
        if (res.rows.length > 0) {
            const wkbBuffer = res.rows[0].geom;
            const geometry = wkx.Geometry.parse(wkbBuffer).toGeoJSON();
            
            console.log('Geometrie als GeoJSON:', geometry);
        } else {
            console.log('Geen geometrie gevonden in de tabel.');
        }

    } catch (error) {
        console.error('Fout bij het ophalen van geometrie:', error);
    } finally {
        await client.end();
    }
}

fetchGeometry();