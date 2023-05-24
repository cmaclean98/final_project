// set my mapboxgl access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2ptNjQ2IiwiYSI6ImNsaGplcXo0czA2ZGEzdHBzazc4bDQwc3IifQ.uxuDYHp-KiSd9e93_KaQfQ';

const FIDI_COORDINATES = [-74.005848, 40.707656]

const map = new mapboxgl.Map({
  container: 'map', // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [-73.97, 40.70], // starting position [lng, lat]
  zoom: 10, // starting zoom
  bearing: 0,
  pitch: 0
});


map.on('load', function () {

  // add the polygon source and layer
  map.addSource('my-polygons', {
    type: 'geojson',
    data: myPolygons
  })

  map.addLayer({
    id: 'fill-my-polygons',
    type: 'fill',
    source: 'my-polygons',
    paint: {
      'fill-color': '#30B8EF',
      'fill-opacity': .4
    }
  })

  // add a line layer that uses the polygon source
  map.addLayer({
    id: 'line-my-polygons',
    type: 'line',
    source: 'my-polygons',
    paint: {
      'line-color': '#495256',
      'line-width': 5,
    },
    layout: {
      'line-cap': 'round'
    }
  })

  // add the parking rules linestring source and layer
  map.addSource('my-lines', {
    type: 'geojson',
    data: myLines
  })

  map.addLayer({
    id: 'line-my-lines',
    type: 'line',
    source: 'my-lines',
    paint: {
      'line-width': 10,
      'line-color': '#A3F51E'
    },
    layout: {
      'line-cap': 'round'
    }
  })

  map.on('click', 'line-my-lines', (e) => {
    const feature = e.features[0]
    new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(feature.properties.Zone)
      .addTo(map);
  });

  // add the point source and layer
  map.addSource('my-points', {
    type: 'geojson',
    data: myPoints
  })

  map.addLayer({
    id: 'circle-my-points',
    type: 'circle',
    source: 'my-points',
    paint: {
      'circle-radius': 20,
      'circle-opacity': .6,
      'circle-color': [
        'match',
        ['get', 'Kind'],
        'Lot',
        '#F5D42C',
        'Garage',
        '#F5722C',
          /* other */ '#ccc'],
    }
  }),

    map.on('click', 'circle-my-points', (e) => {
      const feature = e.features[0]
      new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.Name)
        .addTo(map);
    });

  // Change the cursor to a pointer when the mouse is over the points layer.
  map.on('mouseenter', 'my-points', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'my-points', () => {
    map.getCanvas().style.cursor = ''
  })

  //enable fly to
  $('#fly-to-fidi').on('click', function () {
    map.flyTo({
      center: [-74.00639575701194, 40.708072904009235],
      zoom: 16.5
    })
  })
  //format legend
  const legendItems = [
    { name: 'Parking Lot', color: '#F5D42C' },
    { name: 'Parking Garage', color: '#F5722C' },
    { name: 'Street Parking', color: '#A3F51E' },
  ];

  legendItems.forEach(item => {
    const legendItem = $('<div>').addClass('legend-item');
    const legendColor = $('<div>').addClass('legend-color').css('background-color', item.color);
    const legendText = $('<span>').text(item.name);
    legendItem.append(legendColor).append(legendText);
    $('#legend').append(legendItem);

  });
  const legendControl = new mapboxgl.Control({ element: $('#legend')[0] });
  map.addControl(legendControl);
})
