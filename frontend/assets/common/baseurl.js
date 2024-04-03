                        import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.254.100:4000/api/v1/'
: baseURL = 'http://192.168.254.150:4000/api/v1/'
}

export default baseURL;