import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
const Map = () => {
    const [directions, setDirections] = useState(null);
    const [current, setCurrent] = useState(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [start, setStart] = useState([]);
    const { id } = useParams();
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    //fetch current location for you
    useEffect(() => {
        const getHighAccuracyLocation = async () => {
            const response = await fetch(
                `https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`,
                {
                    method: "POST",
                }
            );
            const data = await response.json();
            console.log("High Accuracy Location:", data.location);
            setCurrent(data.location);
        };
        setInterval(() => {
            getHighAccuracyLocation()
        }, 5000);
    }, [])

    const fethcproductbyid = async () => {
        try {
            const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/fetch/${id}`, {
                method: "GET",
            });
            const data = await response.json();
            setStart(data.data.location)
        } catch (error) {
            console.error(error)
        }
    }
    console.log(start)
    useEffect(() => {
        setInterval(() => {
            fethcproductbyid()
        }, 5000);
    }, [])
    const calculateRoute = async () => {
        if (!isApiLoaded || !window.google) {
            console.error("Google Maps API is not loaded");
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        if (start && current) {
            const origin = `${current.lat},${current.lng}`;
            const destination = `${start.lat},${start.lng}`;


            directionsService.route(
                {
                    origin, // Replace with valid locations
                    destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK" && result) {
                        setDirections(result);
                    } else {
                        console.error("Error fetching directions:", status);
                    }
                }
            );
        } else {
            console.log("invalid location");
        }
    };

    useEffect(() => {
        if (isApiLoaded && current) {
            calculateRoute();
            const interval = setInterval(() => {
                calculateRoute();
            }, 60000); // Refresh route every 5 seconds
            return () => clearInterval(interval);
        }
    }, [isApiLoaded, current, start]);

    return (
        <LoadScript
            googleMapsApiKey= {API_KEY}
            onLoad={() => setIsApiLoaded(true)} // Mark API as loaded
        >
            <GoogleMap
                center={{ lat: 19.076, lng: 72.8777 }} // Coordinates for Mumbai
                zoom={10}
                mapContainerStyle={{ width: "100%", height: "400px" }}
            >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
}

export default Map