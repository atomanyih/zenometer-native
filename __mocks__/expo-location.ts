import {LocationObject, LocationPermissionResponse} from "expo-location/src/Location.types";
import {extendJestMock} from "../src/spyOnAsync";

beforeEach(() => {
  console.log('hellloo')
});

export const requestPermissionsAsync = extendJestMock<LocationPermissionResponse>();
export const getCurrentPositionAsync = extendJestMock<LocationObject>();
export const PermissionStatus = {GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined'};

// we need this definition, but it's blocked by the mock
// mockblocked