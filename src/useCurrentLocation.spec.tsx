import * as Location from 'expo-location';
import {PermissionStatus} from 'expo-location';
import * as React from "react";
import useCurrentLocation, {LocationResult, LocationResultIncomplete} from "./useCurrentLocation";
import {act, render} from "@testing-library/react-native";
import {LocationObject, LocationPermissionResponse} from "expo-location/src/Location.types";
import {AsyncMock} from "./spyOnAsync";

describe('does the mock work tho', () => {
  const action = async () => {
    const promise = Location.requestPermissionsAsync();
    // console.log({promise})
    const {status} = await promise;
    // console.log(status)
    return status;
  };

  xit('works with jest mockresolvedvalue', async () => {
    let val: PermissionStatus;
    const response = {
      status: PermissionStatus.GRANTED,
      expires: 1,
      granted: true,
      canAskAgain: true,
    };
    (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolvedValueOnce(
      response
    );

    const promise = action();
    promise.then(value => {
      console.log('hello');
      val = value
    });
    // @ts-ignore
    expect(val).toBeUndefined();
    expect(Location.requestPermissionsAsync).toHaveBeenCalled();

    await promise
    // await (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolveNext(response)
    // await new Promise((res) => setImmediate(res))
    // @ts-ignore
    expect(val).toEqual('granted')
  });

  it('please works', async () => {
    let val: PermissionStatus;
    const response = {
      status: PermissionStatus.GRANTED,
      expires: 1,
      granted: true,
      canAskAgain: true,
    };

    const promise = action();
    promise.then(value => {
      // console.log('assigning');
      val = value

      // console.log({val})
    });
    // @ts-ignore
    expect(val).toBeUndefined();
    expect(Location.requestPermissionsAsync).toHaveBeenCalled();

    await (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolveNext(response)
    await new Promise((res) => setImmediate(res))
    // console.log('about to assert')

    // @ts-ignore
    expect(val).toEqual('granted');
    // expect(await promise).toEqual('granted')
  });

  xit('sanity check', () => {
    const response = {
      status: PermissionStatus.GRANTED,
      expires: 1,
      granted: true,
      canAskAgain: true,
    };

    const promise = Location.requestPermissionsAsync()
    console.log((Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).getMockImplementation());
    console.log({promise});

    (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolveNext(response);
  });
});

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

        console.log('status is granted')
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
          console.log('loc returned')

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

    xdescribe('status is not granted', () => {
      beforeEach(async () => {
        await (Location.requestPermissionsAsync as AsyncMock<LocationPermissionResponse>).mockResolveNext({
          status: PermissionStatus.DENIED,
          expires: 'never',
          granted: false,
          canAskAgain: true,
        })

        console.log('status is not granted')
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
