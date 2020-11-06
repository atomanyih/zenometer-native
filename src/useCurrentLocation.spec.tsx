import * as Location from 'expo-location';
import {PermissionStatus} from 'expo-location';
import * as React from "react";
import useCurrentLocation, {LocationResult, LocationResultIncomplete} from "./useCurrentLocation";
import {act, render} from "@testing-library/react-native";
import {LocationObject, LocationPermissionResponse} from "expo-location/src/Location.types";
import {AsyncMock} from "./spy-on-async/spyOnAsync";

describe('useCurrentLocation', () => {
  function setup() {
    const returnVal: LocationResultIncomplete = {
      state: 'incomplete'
    };

    function TestComponent() {
      Object.assign(returnVal, useCurrentLocation());
      return null;
    }

    render(<TestComponent/>);
    return returnVal;
  }

  let hookData: LocationResult;

  beforeEach(() => {
    hookData = setup();
  });

  it('asks for location permission', () => {
    expect(Location.requestPermissionsAsync).toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  describe('permission is requested', () => {
    describe('status is granted', () => {
      beforeEach(async () => {
        await (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolveNext({
          status: PermissionStatus.GRANTED,
          expires: 'never',
          granted: true,
          canAskAgain: true,
        })
      });

      it('calls for position', async () => {
        expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      });
      describe('when location is returned', () => {
        const locationObject = {
          coords: {
            latitude: 0,
            longitude: 0,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        };

        beforeEach(async () => {
          await act(async () => {
            await (Location.getCurrentPositionAsync as AsyncMock<LocationObject>).mockResolveNext(locationObject)
          })
        });

        it('returns location', () => {
          expect(hookData).toEqual({
            state: 'success',
            location: locationObject
          })
        });
      });
    });

    describe('status is not granted', () => {
      beforeEach(async () => {
        await act(async () => {
          await (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolveNext({
            status: PermissionStatus.DENIED,
            expires: 'never',
            granted: false,
            canAskAgain: true,
          });
        });
      });

      it('returns an error result', () => {
        expect(hookData).toEqual({
          state: 'error',
          errorMsg: 'Permission to access location was denied'
        })
      });
    });
  });
});
