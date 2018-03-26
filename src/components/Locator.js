/*global google*/
import React from "react"
import './Locator.css'
import { compose, withProps, withHandlers, withState } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import {SearchBox} from "react-google-maps/lib/components/places/SearchBox"



const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5eCcxmxACztRIVrfTXxr28d_uegRmMks&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div className='map' style={{ height: `100%` }} />,
        containerElement: <div className='map' style={{ height: `400px` }} />,
        mapElement: <div className='map' style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withState('selectedPlace', 'updateSelectedPlace', null),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }

        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            onSearchBoxMounted: () => ref => {
                refs.searchBox = ref
            },
            fetchPlaces: ({ updatePlaces }) => () => {
                const bounds = refs.map.getBounds();
                const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    bounds: bounds,
                    type: ['points_of_interest'],
                    name: 'paintball'
                };
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        updatePlaces(results);
                    }
                })
            },
            onToggleOpen: ({ updateSelectedPlace}) => key => {
                updateSelectedPlace(key);
            }
        }
    }),
)((props) => {
    return (
        <GoogleMap
            onTilesLoaded={props.fetchPlaces}
            ref={props.onMapMounted}
            onBoundsChanged={props.fetchPlaces}
            defaultZoom={10}
            defaultCenter={{ lat: 40.2574448, lng: -111.7089488 }}
        >
        <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}>
            <input
            type='text'
            placeholder='ghost of text past'
            style={{
                boxSizing: 'border-box',
                border: '1px solid transparent',
                width: '240px',
                height: '32px',
                marginTop: '27px',
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`
            }}
            />
            </SearchBox>
            {props.places && props.places.map((place, i) =>
                <Marker 
                onClick={() => props.onToggleOpen(i)} 
                key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}>
                {props.selectedPlace === i && <InfoWindow onCloseClick={props.onToggleOpen}>
            
                    <div>
                        {props.places[props.selectedPlace].name} <br/>
                        {props.places[props.selectedPlace].rating}
                        
                    </div>
                </InfoWindow>}
                </Marker>
            )}
        </GoogleMap>
    )
})

export default class Locator extends React.PureComponent {
    constructor(props){
        super(props);

        this.state={
            slide:true
        }
    }
    render() {
        return (
            <div>
            <nav className="nav">
                
            <div onClick={()=>this.setState({slide:!this.state.slide})}
                className="arrow">V</div>
            <div className="arrow">FIELD/STORE LOCATOR</div>
                <a href="http://localhost:3000/">
                <button className="logout">BEGONE</button></a>
        </nav>
        <div className={this.state.slide?'slide dropdown':'dropdown'}>
                <a href='http://localhost:3000/#/locator'>
                    <button className='fs_locator'>Field/Store Locator</button></a>
                    <a href='http://localhost:3000/#/create'>
                    <button className='fs_locator'>Create A Review</button></a>
                    <div className='forums'>Forums</div>
                    <div className='events'>Events</div>
                    <div className='np_guide'>New Player Guide</div>
                </div>
                    <MyMapComponent />
            </div>
            
        )
    }
}