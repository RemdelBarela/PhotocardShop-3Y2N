import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.100.38:4000/api/v1/'
: baseURL = 'http://192.168.100.50:4000/api/v1/'
}

export default baseURL;