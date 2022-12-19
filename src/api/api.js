import axios from "axios";

let adress = "http://45.144.31.110:3000/";

let instance =  axios.create({
    baseURL: adress
});

export default {
    getCategoriesByParent(parentId){
        let table = "category_lr?";
    
        let url_params = "id_parent=eq." + parentId;
    
        return instance.get(table + url_params);
    }
}

