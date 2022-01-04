import { arrayUnion } from "firebase/firestore"
import FirebaseContainer from "../../contenedores/firebaseContainer.js"

export default class CartFirebase extends FirebaseContainer {
    constructor () {
        super ("carritos")
    }
}