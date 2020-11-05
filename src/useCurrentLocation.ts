import * as Location from 'expo-location';
import {useEffect, useState} from 'react';
import {LocationObject} from "expo-location/src/Location.types";

export type LocationResultIncomplete = {
  state: 'incomplete'
}

export type LocationResultSuccess = {
  state: 'success',
  location: LocationObject
}

export type LocationResultError = {
  state: 'error',
  errorMsg : string
}

export type LocationResult =
  | LocationResultIncomplete
  | LocationResultError
  | LocationResultSuccess;

const useCurrentLocation = () => {
  const [result, setResult] = useState<LocationResult>({state: 'incomplete'});

  useEffect(() => {
    // console.log('call me');

    (async () => {

      // console.log('async');
      const {status} = await Location.requestPermissionsAsync();

      // console.log('status', status);

      if (status !== 'granted') {
        setResult({
          state: 'error',
          errorMsg: 'Permission to access location was denied'
        });
      }
      const location = await Location.getCurrentPositionAsync();

      setResult({
        state: 'success',
        location
      })
    })();
  }, []);

  return result
};

export default useCurrentLocation;