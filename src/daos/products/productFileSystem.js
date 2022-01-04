import FileContainer from "../../contenedores/fileContainer.js";

export default class ProductFileSystem extends FileContainer {
    constructor() {
        super("products.txt")
    }
}