import {httpGet, httpPost} from './httprequest';

export const getChannelInfo = (params) => {
    return httpGet('/isChannelExists',params);
}

export const privateMessage = (body) => {
    var headers = {};
    headers['Content-Type'] = 'application/json';
    return httpPost('/privateMessage',body,headers);
}

export const connectionTermination = (channelName,userId) => {
    var headers = {};
    headers['Content-Type'] = 'application/json';
    var body = {
        "channelName" : channelName,
        "userId" : userId
    }
    return httpPost('/terminate',body,headers);
}