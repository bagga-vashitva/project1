import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { useJsApiLoader, Marker, GoogleMap, Autocomplete } from '@react-google-maps/api';

const center = { lat: 43.45043203728368, lng: -80.48755699006638 };

const Function1 = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_SOME_KEY,
    libraries: ['places'],
  });

  console.log(import.meta.env.VITE_SOME_KEY);
  
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMap(map);
  };

  const originRef = useRef();
  const destinationRef = useRef();

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDistance('');
    setDuration('');
    setDirectionsResponse(null);
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  return (
    <>
      {!isLoaded && <div>Loading...</div>}
      {isLoaded && (
        <Flex
          color="white"
          position="relative"
          flexDirection="column"
          alignItems="center"
          h="100vh"
          w="100vw"
        >
          <Box position="absolute" left={0} top={0} h="100%" w="100%">
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={handleMapLoad}
            >
              <Marker position={center} />
              {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
            </GoogleMap>
          </Box>

          <Box
            p={4}
            borderRadius="lg"
            m={4}
            bgColor="white"
            shadow="base"
            minW="container.md"
            zIndex="1"
          >
            <HStack spacing={2} justifyContent="space-between">
              <Box flexGrow={1}>
                <Autocomplete>
                  <Input type="text" placeholder="Origin" ref={originRef} />
                </Autocomplete>
              </Box>
              <Box flexGrow={1}>
                <Autocomplete>
                  <Input type="text" placeholder="Destination" ref={destinationRef} />
                </Autocomplete>
              </Box>
              <ButtonGroup>
                <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
                  Calculate Route
                </Button>
                <IconButton
                  aria-label="center back"
                  icon={<FaTimes />}
                  onClick={clearRoute}
                />
              </ButtonGroup>
            </HStack>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Function1;
