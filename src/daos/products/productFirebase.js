import FirebaseContainer from "../../contenedores/firebaseContainer.js";

export default class ProductFirebase extends FirebaseContainer {
    constructor () {
        super ("productos")
    }
}