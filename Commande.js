'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Commande extends Model {
    /**
     * @swagger
     * definitions:
     *  Commande:
     *      type: object
     *      properties:
     *          articles:
     *              type: array
     *              items:
     *                  type: object
     *                  properties:
     *                      id:
     *                          type: integer
     *                      quantite:
     *                          type: integer
     *                  required:
     *                      - id
     *                      - quantite
     *          total_commande:
     *              type: number
     *          mode_paiement:
     *              type: string
     *          id_client:
     *              type: number
     *          status:
     *              type: string
     */

    id = Number()

    articles = String()

    total_commande = Number()

    mode_paiement = String()

    id_client = Number()

    status = String()

    createdAt = Date()

    updatedAt = Date()
}

module.exports = Commande