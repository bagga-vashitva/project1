import React, { useRef, useState } from "react";
import { useJsApiLoader , GoogleMap,Marker ,Autocomplete , DirectionsRenderer } from "@react-google-maps/api";
import { Button, IconButton, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import NearMeIcon from '@mui/icons-material/NearMe';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


const center ={lat:28.6665,lng:77.2333}
export default function Map(){

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false)


    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:"AIzaSyDO_ixC0ugp6gNOcZN-Y1ozRPAMka8YTeA",
        libraries:['places']
    })
    const [map,setMap] = useState(/** @type google.maps.Map */(null))
    const [directionResponse,setDirectionResponse]=useState(null)
    const [duration,setDuration]=useState(null)
    const [distance,setDistance]=useState(null)


    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef= useRef()

    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef()

    if(!isLoaded){
       return <Skeleton/>
    }
    
    async function calculateRoute(){
        if(originRef.current.value === '' || destinationRef.current.value === ''){
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();

        const results = await directionsService.route({
            origin:originRef.current.value,
            destination:destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode:google.maps.TravelMode.DRIVING
        })

        const fair = {distance}*10;
        console.log(fair)

        setDirectionResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    function clearRoute(){
        setDirectionResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    return(
        <div className="ride-book">
            <Box 
            display="flex"
            margin={2}
            gap={3} className="booking-map">    
                <Autocomplete>        
                <input type="text" id="from" placeholder="Origin" ref={originRef}/>
                </Autocomplete> 
                <Autocomplete>
                <input type="text" id="to" placeholder="Destination" ref={destinationRef}/>
                </Autocomplete> 
                <button type="submit" onClick={calculateRoute}>Calculate Route</button>
                <button type="submit" onClick={clearRoute}>Clear Route</button>
                <button onClick={handleOpen}>Book a cab
                
                    </button>
                </Box>
                <Box
                display={"flex"}
                gap={15}
                margin={2}>
                <Typography variant="h5">Distance:{distance}</Typography>
                <Typography variant="h5">Duration:{duration}</Typography>
                <NearMeIcon onClick={()=> map.panTo(center)}/>
            </Box>
            <Box position='relative' left={100} top={0} h="80%" width={"80%"} className="map">
                <GoogleMap 
                center={center} 
                zoom={15} 
                mapContainerStyle={{width:"600px",height:"600px"}}
                options={{
                    zoomControl:false,
                    streetViewControl:false,
                    mapTypeControl:false,
                    fullscreenControl:false
                }}
                onLoad={map => setMap(map)}>
                    <Marker position={center}/>
                    {directionResponse && <DirectionsRenderer directions={directionResponse}/>}
                </GoogleMap>
            </Box>
        </div>
    )
}