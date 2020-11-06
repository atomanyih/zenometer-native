import {LocationObject, LocationPermissionResponse} from "expo-location/src/Location.types";
import {createAsyncMock} from "../src/spy-on-async/spyOnAsync";

export const requestPermissionsAsync = createAsyncMock<LocationPermissionResponse>();
export const getCurrentPositionAsync = createAsyncMock<LocationObject>();
export const PermissionStatus = {GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined'};

// we need this definition, but it's blocked by the mock
// mockblocked