import {DEFAULT_REGION} from "./constants";
export const getRegion = () =>{
    var region = localStorage.getItem("region");
    if(region === undefined){
        return DEFAULT_REGION;
    }else{
        return region;
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const getOpAsset = (operator) => {
    return process.env.PUBLIC_URL + "/assets/operators/" + operator
}

export const getAsset = (asset, name) => {
    return process.env.PUBLIC_URL + "/assets/" + asset + "/" + name;
}

export const getRegionQuery = (addition = false) =>{
    var region = getRegion();
    if(region === "GLOBAL"){
        return ""
    }else{
        if(addition){
            console.log("get region addition query")
            return "&region="+region
        }else{
            return "?region="+region;
        }
        
    }
}
export const setRegion = (region) =>{
    localStorage.setItem("region", region);
}