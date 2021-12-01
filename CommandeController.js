'use strict'

const Commande = use('App/Models/Commande')
const QuantiteArticleCommande = use('App/Models/QuantiteArticleCommande')

class CommandeController {
    /**
     * @swagger
     * /commande:
     *   get:
     *     tags:
     *       - API commande
     *     summary: renvoi toutes les commande
     *     responses:
     *       200:
     *         description: renvoi la liste des commande enregistres
     */
    async index() { return Commande.all() }

    /**
     * @swagger
     * /commande:
     *   post:
     *     tags:
     *       - API commande
     *     summary: enregistre une nouvelle commande
     *     parameters:
     *         - name: commande
     *           in: body
     *           required: true
     *           schema:
     *              $ref: "#/definitions/Commande"
     *     responses:
     *       201:
     *         description: Commande enregistree avec succes
     *       500:
     *         description: une Erreur s'est produite lors de la creation de la commande, verifiez les erreurs
     */
    async store({ request, response }) {
        try {
            const total = request.input('total_commande')
            const pay = request.input('mode_paiement')
            const client = request.input('id_client')
            const stat = request.input('status')
            const articles_ = request.input('articles')
            let text = ""

            articles_.forEach(async function(item) {
                text += "{" + item.id + ": " + item.quantite + "}"
            })

            const commande_ = await Commande.create({
                total_commande: total,
                mode_paiement: pay,
                id_client: client,
                status: stat,
                articles: text
            })

            /* try {
                const articles_ = await request.input('articles')
                articles_.forEach(async function(item) {
                    await ArticleCommande.create({
                        id_article: item.id,
                        quantite_article_commande: item.quantite,
                        id_commande: commande_.$attributes.id
                    })
                })
            } catch (error) {
                return error
            } */
            return response.status(202).json(commande_)
        } catch (error) {
            console.log(error)
            return response.status(500).send('Stockage impossible, veuillez reessayer!')
        }
    }

    /**
     * @swagger
     * /commande/{id}:
     *   get:
     *     tags:
     *       - API commande
     *     summary: renvois la commande correspondante a l'identifiant
     *     parameters:
     *         - name: id
     *           desciption: identifiant
     *           in: path
     *           schema:
     *              type: number
     *     responses:
     *       200:
     *         description: Commande renvoyee avec succes
     *       400:
     *         description: Aucun resultat
     */
    async show({ response, params }) {
        try {
            const commande_ = await Commande.findOrFail(params.id)
            return response.status(202).json(commande_)
        } catch (error) {
            console.log(error)
            return response.status(500).send(error)
        }
    }

    /**
     * @swagger
     * /commande/info/{id}:
     *   get:
     *     tags:
     *       - API commande
     *     summary: renvois plus d'info sur une commande
     *     parameters:
     *         - name: id
     *           desciption: identifiant
     *           in: path
     *           schema:
     *              type: number
     *     responses:
     *       200:
     *         description: More info
     *       400:
     *         description: Aucun resultat
     */
    async showQuantityArticlesOrdered({ params }) {
        try {
            const commande_ = await Commande.findOrFail(params.id)
            let reg = new RegExp("[{: }]+", "g"),
                j = 0,
                table = commande_.$attributes.articles.split(reg),
                tab = []
            for (let i = 1; i < table.length - 2; i += 2) {
                let quantite_article_commande = new QuantiteArticleCommande(parseInt(table[i]), parseInt(table[i + 1]))
                tab[j++] = quantite_article_commande
            }
            return tab
        } catch (error) {
            console.log(error)
            return error
        }
    }

    /**
     * @swagger
     * /commande/{id}:
     *   put:
     *     tags:
     *       - API commande
     *     summary: met a jour une commande
     *     parameters:
     *         - name: id
     *           desciption: identifiant
     *           in: path
     *           schema:
     *              type: number
     *         - name: commande
     *           in: body
     *           required: true
     *           schema:
     *              $ref: "#/definitions/Commande"
     *     responses:
     *       202:
     *         description: commande mis a jour avece succes
     *       500:
     *         description: une erreur s'est produite lors de la mise a jour
     */
    async update({ request, response, params }) {
        try {
            const commande_ = await Commande.findOrFail(params.id)
            commande_.total_commande = request.input('total_commande')
            commande_.mode_paiement = request.input('mode_paiement')
            commande_.id_client = request.input('id_client')
            commande_.status = request.input('status')
            commande_.save()
            return response.status(202).json(commande_)
        } catch (error) {
            return response.status(500).send('Echec de la mise a jour, veuillez reessayer!')
        }
    }

    /**
     * @swagger
     * /commande/{id}:
     *   delete:
     *     tags:
     *       - API commande
     *     summary: supprime une commande
     *     parameters:
     *         - name: id
     *           desciption: identifiant
     *           in: path
     *           schema:
     *              type: number
     *     responses:
     *       203:
     *         description: commande supprimee avec succes
     *       400:
     *         description: aucune commande ne correspond a cet identifiant
     */
    async destroy({ params, response }) {
        try {
            const commande_ = await Commande.find(params.id)
            await commande_.delete()
            return response.status(203).send('suppression reussie')
        } catch (error) {
            return response.status(500).send('Aucun resultat ne correspond a cet id')
        }
    }
}

module.exports = CommandeController