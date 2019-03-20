import {DEFAULT_REGION} from "./constants";
export const getRegion = () =>{
    var region = localStorage.getItem("region");
    if(region == undefined){
        return DEFAULT_REGION;
    }else{
        return region;
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const getRegionQuery = () =>{
    var region = getRegion();
    if(region === "GLOBAL"){
        return ""
    }else{
        return "?region="+region;
    }
}
export const setRegion = (region) =>{
    localStorage.setItem("region", region);
}