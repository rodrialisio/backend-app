import "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, addDoc , updateDoc, deleteDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfuStC0RiaGtD6EUc6DMaVBYWWUlzVfjQ",
  authDomain: "ecommerce-bb234.firebaseapp.com",
  projectId: "ecommerce-bb234",
  storageBucket: "ecommerce-bb234.appspot.com",
  messagingSenderId: "369715328175",
  appId: "1:369715328175:web:a61ec15154877e34ab105a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default class FirebaseContainer {
    constructor(collection) {
        this.collection= collection
    }

    register = async (product)=> {
        try {
            const currentCollection = collection(db,this.collection)
            const productSnapshot = await getDocs(currentCollection)
            const productList = productSnapshot.docs.map(doc => doc.data())
            if (productList.find(p=> p.title == product.title)) {
                return {status:"error", message: "el producto ya existe"}
            } else {
                const result = await addDoc(collection(db, this.collection), {
                    title: product.title,
                    description: product.description,
                    code: product.code,
                    price: product.price,
                    stock: product.stock,
                    thumbnail:product.thumbnail,
                    timestamp: Timestamp.fromDate(new Date())
                  })
                return {status:"success", message:"producto creado", payload:result}
            }
        } catch (err) {
            console.log(err)
            return {status:"error", message: err}
        }
    }

    create = async ()=> {
        try {
            const result = await addDoc(collection(db, this.collection), {
                products:[],
                timestamp: Timestamp.fromDate(new Date())
              })
            return {status:"success", message:"carrito creado"}
        } catch (err){
            return {status:"error", message: err}
        }
    }

    getAll = async ()=> {
        try {
            const querySnapshot = await getDocs(collection(db, this.collection))
            const productList = querySnapshot.docs.map(doc => doc.data())
            if (productList.length>0) {
                return {status: "success", payload: productList}
            } else {
                return {status:"error", message: "no hay items"}
            }
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    getById= async (id)=> {
        try {
            const docRef = doc(db, this.collection,id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return {status: "success", payload: docSnap.data()}
            } else {
                return {status:"error", message: "no se encontró el id"}
            }
        } catch {
            return {status:"error", message: err}
        }
    }

    getContentById = async (id)=> {
        try {
            const docRef = doc(db,this.collection,id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                return {status: "success", message:`productos en el carrito ${id}`, payload: docSnap.data().products}
            } else {
                return {status:"error", message: "no se encontró el id"}
            }
        } catch {
            return {status:"error", message: err}
        }
    }

    updateById = async (id,body)=> {
        try {
            const docRef = doc(db,this.collection,id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                body.timestamp = Timestamp.fromDate(new Date())
                let result= await updateDoc(docRef, body)
                return {status:"success", message: "producto actualizado", payload: result}
            } else {
                return {status: "error", message: "no se encontró el id"}
            }
        } catch (err) {
            console.log(err)
            return {status:"error", message: err}
        }
    }

    addContentById = async (cid,pid)=> {
        try {     
            const cartRef = doc(db, this.collection, cid)
            const cartSnap= await getDoc(cartRef)
            if (cartSnap.exists()) {                
                const querySnapshot = await getDoc(doc(db, "productos",pid))
                if (querySnapshot.exists()) {
                    const result = await updateDoc(cartRef, {
                        products: arrayUnion(pid)
                    })
                    return {status:"success", message:`producto ${pid} agregado al carrito ${cid}`, payload: result}
                } else {
                    return {status:"error", message: `no se encontró el producto ${pid}... `}
                }
            } else {
                return {status:"error", message: `no se encontró el carrito ${cid}... `}
            }
        } catch (err) {
            return {status:"error", message: err}
        }
    }

    deleteById = async (id)=> {
        try {
            const docRef = doc(db,this.collection,id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                await deleteDoc(doc(db, this.collection, id))
                return {status:"success", message: "se eliminó el item"}
            } else {
                return {status:"error", message:"no se encontró el id"}
            }
        } catch (err) {
            console.log(err)
            return {status:"error", message: err}
        }
    }

    removeContentById = async (cid,pid)=> {
        try {
            const cartRef = doc(db, this.collection, cid)
            const cartSnap= await getDoc(cartRef)
            if (cartSnap.exists()) {
                const cart = cartSnap.data()
                if (cart.products.find(p=> p == pid)) {
                    const result = await updateDoc(cartRef, {
                        products: arrayRemove(pid)
                    })
                    return {status:"success", message:`producto ${pid} removido del carrito ${cid}`, payload: result}
                } else {
                    return {status:"error", message: "no se encontró el producto"}
                }
            } else {
                return {status:"error", message: `no se encontró el carrito ${cid}... `}
            }
        } catch (err) {
            return {status:"error", message: `no se encontró el carrito ${cid}... `+err}
        }
    }
}

