import {httpPost} from './httprequest';

export const createChannel = function(userName,channelName){  
    var headers = {};
    headers['Content-Type'] = 'application/json';
    var body = {
        "channelName" : channelName,
        "userName" : userName
    }
    return httpPost('/create',body,headers);
}

export const joinChannel = function(userName,channelName){
    var headers = {};
    headers['Content-Type'] = 'application/json';
    var body = {
        "channelName" : channelName,
        "userName" : userName
    }
    return httpPost('/join',body,headers);
}