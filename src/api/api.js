import axios from "axios";

let adress = "http://45.144.31.110:3000/";

let instance =  axios.create({
    baseURL: adress
});

export default {
    getCategories(urlParams = ''){
        let table = "category_lr?";
    
        return instance.get(table + urlParams);
    },
    getResearches(urlParams = ''){
        let table = "lab_research?";
    
        return instance.get(table + urlParams);
    },
    getOptions(urlParams = ''){
        let table = "laboratorys_options?";
    
        return instance.get(table + urlParams);
    }
}

