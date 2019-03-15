export const BACKEND_URL = "http://127.0.0.1:8080/api/";
export const OPERATOR_DROPDOWN_URL =  BACKEND_URL + "dropdown/operator_list";
export const SEARCH_R6TAB_USERNAME_URL = BACKEND_URL + "r6tab/username/"; 
export const SUBMIT_REPORT_USER = BACKEND_URL + "report/submit/";
export const SEARCH_USER = BACKEND_URL + "search"
export const DEFAULT_REGION = "GLOBAL";
export const REGION_TEXT_MAP = {
    "GLOBAL": "Global",
    "NA": "America",
    "EU": "Europe",
    "AS": "Asia"
}
export const REGION_VALUE_MAP = {
    "Global": "GLOBAL",
    "America": "NA",
    "Europe": "EU",
    "Asia": "AS"
}
export const REGION_OPTIONS = [
    {value:'GLOBAL', text:'Global'},
    {value:'NA', text:'America'},
    {value:'EU', text:'Europe'},
    {value:'AS', text:'Asia'},
];