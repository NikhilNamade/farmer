import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { useParams } from "react-router-dom";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Map = () => {
  const [directions, setDirections] = useState(null);
  const [current, setCurrent] = useState(null);
  const [start, setStart] = useState(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const {id} = useParams();
  // Function to fetch location using browser's Geolocation API
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrent(newLocation);
          updatelocation(newLocation);
        },
        async (error) => {
          console.error("Geolocation error:", error);
          // Fallback to Google Geolocation API if browser method fails
          const response = await fetch(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`,
            { method: "POST" }
          );
          const data = await response.json();
          if (data.location) {
            setCurrent({ lat: data.location.lat, lng: data.location.lng });
            updatelocation({ lat: data.location.lat, lng: data.location.lng });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  // Function to update location in the database
  const updatelocation = async (newLocation) => {
    try {
      const formdata = new FormData();
      formdata.append("lat", newLocation.lat);
      formdata.append("lng", newLocation.lng);

      const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/updatelocation", {
        method: "PUT",
        headers: {
          token: localStorage.getItem("token"),
        },
        body: formdata,
      });

      const data = await response.json();
      console.log("Location Updated:", data);
    } catch (error) {
      console.log("Error updating location:", error);
    }
  };

  // Function to fetch product location
  const fetchProductById = async () => {
    try {
      const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/fetch/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setStart(data.data.location);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Function to calculate route
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
          origin,
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
      console.log("Invalid location for route calculation.");
    }
  };

  // UseEffect to fetch initial location and product data
  useEffect(() => {
    getCurrentLocation(); // Get location when component mounts
    fetchProductById();
  }, []);

  // Update route when locations change
  useEffect(() => {
    if (isApiLoaded && current && start) {
      calculateRoute();
    }
  }, [isApiLoaded, current, start]);

  return (
    <LoadScript googleMapsApiKey={API_KEY} onLoad={() => setIsApiLoaded(true)}>
      <GoogleMap
        center={current || { lat: 19.076, lng: 72.8777 }} // Default to Mumbai if no location
        zoom={10}
        mapContainerStyle={{ width: "100%", height: "400px" }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
