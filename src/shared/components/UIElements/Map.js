/* eslint-disable */
import React, { useRef, useEffect } from "react";

import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWdhdXJhdiIsImEiOiJjbGJrbDRjNmgwMWJsM3V0cmI0ZThsa3A2In0.iA9BMdFbG2TRygRX-13kSQ";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom, title } = props;

  useEffect(() => {
    const el = document.createElement("div");
    el.className = "marker";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: center,
      zoom: zoom,
      scrollZoom: false,
    });

    // const bounds = new mapboxgl.LatLngBounds();

    //Adding a marker
    new mapboxgl.Marker({
      element: el,
      // anchor: "top",
    })
      .setLngLat(center)
      .addTo(map);

    // Adding a popup
    new mapboxgl.Popup()
      .setLngLat(props.center)
      .setHTML(`<p>${title}</p>`)
      .addTo(map);

    // bounds.extends(center);
  }, [center, zoom, title]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
