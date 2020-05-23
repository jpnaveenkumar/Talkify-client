//const config = process.env
var baseURL = "http://192.168.43.179:3000"
function generateURLwithParams(path,params){
    path = path + "?";
    var paramKeys = Object.keys(params);
    for(var index=0; index<paramKeys.length; index++){
        path = path + paramKeys[index] + "=" + params[paramKeys[index]] + "&";
    }
    return path;
}

export const httpGet = function(path,params,headers){
    path = baseURL + path;
    return fetch(params == undefined ? path : generateURLwithParams(path,params),{
        headers: headers != undefined ? headers : {}
    }).then((data)=>{
        return new Promise((resolve,reject)=>{
            if(data.status == 200){
                data.json().then((response)=>{
                    return resolve(response.data);
                });
            }
            else{
                data.json().then((response)=>{
                    return reject(response.data);
                });
            }
        });
    });
}

export const httpPost = function(path,body,headers){
    path = baseURL + path;
    return fetch(path,{
        method: "post",
        headers: headers != undefined ? headers : {},
        body: JSON.stringify(body)
    }).then((data)=>{
        return new Promise((resolve,reject)=>{
            if(data.status == 201){
                data.json().then((response)=>{
                    return resolve(response.data);
                });
            }else{
                data.json().then((response)=>{
                    return reject(response.data);
                });
            }
        })
    });
}