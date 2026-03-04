class ProductService {

    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getProducts(query) {

        const {
            limit = 10,
            page = 1,
            sort,
            query: filterQuery
        } = query;

        const filter = {};

        if (filterQuery) {
            if (filterQuery === "true" || filterQuery === "false") {
                filter.status = filterQuery === "true";
            } else {
                filter.category = filterQuery;
            }
        }

        const options = {
            limit: Number(limit),
            page: Number(page),
            lean: true
        };

        if (sort === "asc" || sort === "desc") {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        return this.productRepository.getProducts(filter, options);
    }


    async getProductById(pid) {

        const product = await this.productRepository.getProductById(pid);

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        return product;
    }


    async createProduct(data) {

        return this.productRepository.createProduct(data);

    }


    async updateProduct(pid, data) {

        const product = await this.productRepository.updateProduct(pid, data);

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        return product;
    }


    async deleteProduct(pid) {

        const product = await this.productRepository.deleteProduct(pid);

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        return product;
    }

}

export default ProductService;