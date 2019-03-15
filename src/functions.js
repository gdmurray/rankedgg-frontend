import {DEFAULT_REGION} from "./constants";
export const getRegion = () =>{
    var region = localStorage.getItem("region");
    if(region == undefined){
        return DEFAULT_REGION;
    }else{
        return region;
    }
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