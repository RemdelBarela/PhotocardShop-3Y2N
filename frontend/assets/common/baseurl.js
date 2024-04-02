import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'ios'
? baseURL = 'http://192.168.1.20:4000/api/v1/'
: baseURL = 'http://192.168.1.150:4000/api/v1/'
}

export default baseURL;