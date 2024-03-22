import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'ios'
? baseURL = 'http://192.168.68.111:4000/api/v1/'
: baseURL = 'http://192.168.68.100:4000/api/v1/'
}

export default baseURL;