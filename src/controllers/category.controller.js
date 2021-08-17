const Category = require('./../models/category')
const PAGE_SIZE = 5;

class ProductsController {
    /**
     * Get products
     * @param {*} req
     * @param {*} res
     */
     async index(req, res) {
        try {
            let filter = {}
            if (req.query.search) {
                filter = { 'name' : { '$regex' : req.query.search, '$options' : 'i' } } 
            }
            let categories = {};
            categories = await Category.find(filter)
            res.status(200).send(categories);
        } catch (e) {
            res.status(500).send(e)
        }
    }

    /**
     * Show product by id
     * @param {*} req
     * @param {*} res
     */
     async show(req, res) {
        try {
            const id = req.params.id;
            let category = await Category.findById(id)
            res.status(201).send(category)
        } catch (e) {
            res.status(404).send(e)
        }
    }

    /**
     * Store product
     * @param {*} req
     * @param {*} res
     */
     async store(req, res) {
        const category = new Category(req.body)
        try {
            await category.save()
            res.status(201).send(category)
        } catch (err) {
            res.status(code).json({error});
        }
    }

    /**
     * Update product
     * @param {*} req
     * @param {*} res
     */
     async update(req, res) {
        try {
            const updates = Object.keys(req.body)
            const id = req.params.id;
            let category = await Category.findById(id)
            if (!category) {
                return res.status(404).send()
            }
            updates.forEach((update) => category[update] = req.body[update])
            await category.save()
            res.status(200).send(category)
        } catch (err) {
            res.status(code).json({error});
        }
    }

    /**
     * Delete product
     * @param {*} req
     * @param {*} res
     */
     async delete(req, res) {
        try {
            const id = req.params.id;
            let category = await Category.findById(id)
            if (!category) {
                return res.status(404).send()
            }
            await category.remove()
            res.status(200).send(category)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = ProductsController