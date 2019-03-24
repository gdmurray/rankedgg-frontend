
export const BACKEND_API = process.env.REACT_APP_BACKEND_URL;
export const BACKEND_WS = process.env.REACT_APP_WS_URL;
export const OPERATOR_DROPDOWN_URL =  BACKEND_API + "dropdown/operator_list";
export const SEARCH_R6TAB_USERNAME_URL = BACKEND_API + "r6tab/username/"; 
export const SUBMIT_REPORT_USER = BACKEND_API + "report/submit/";
export const SEARCH_USER = BACKEND_API + "search";
export const TOP_REPORTED_OPERATOR_URL = BACKEND_API + "home/top_operators";
export const TOP_NOTORIOUS_PLAYERS_URL = BACKEND_API + "home/notorious/";
export const FETCH_OPERATORS_URL = BACKEND_API + "operators";
export const PLAYER_LEADERBOARD_URL = BACKEND_API + "leaderboard/";
export const SEARCH_WEBSOCKET_URL = BACKEND_WS + "search/"; 
export const DEFAULT_REGION = "GLOBAL";
export const Attacker = "attacker";
export const Defender = "defender";
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

export const RANK_MAP = {
    0: "Not Ranked",
    1: "Copper IV",
    2: "Copper III",
    3: "Copper II",
    4: "Copper I",
    5: "Bronze IV",
    6: "Bronze III",
    7: "Bronze II",
    8: "Bronze I",
    9: "Silver IV",
    10: "Silver III",
    11: "Silver II",
    12: "Silver I",
    13: "Gold IV",
    14: "Gold III",
    15: "Gold II",
    16: "Gold I",
    17: "Plat III",
    18: "Plat II",
    19: "Plat I",
    20: "Diamond"
}