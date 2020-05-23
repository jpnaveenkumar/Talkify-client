import {httpGet} from './httprequest';

export const getChannelInfo = (params) => {
    return httpGet('/isChannelExists',params);
}