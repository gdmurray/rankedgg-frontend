import {DEFAULT_REGION} from "./constants";
export const getRegion = () =>{
    var region = localStorage.getItem("region");
    if(region == undefined){
        return DEFAULT_REGION;
    }else{
        return region;
    }
}

export const setRegion = (region) =>{
    localStorage.setItem("region", region);
}