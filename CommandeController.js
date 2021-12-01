'use strict'

const Commande = use('App/Models/Commande')
const QuantiteArticleCommande = use('App/Models/QuantiteArticleCommande')

class CommandeController {
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
            return response.status(202).json(commande_)
        } catch (error) {
            console.log(error)
            return response.status(500).send('Stockage impossible, veuillez reessayer!')
        }
    }
    
    async show({ response, params }) {
        try {
            const commande_ = await Commande.findOrFail(params.id)
            return response.status(202).json(commande_)
        } catch (error) {
            console.log(error)
            return response.status(500).send(error)
        }
    }

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
}

module.exports = CommandeController
