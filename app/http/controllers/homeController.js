const Menu = require("../../models/menu")

function homeController () {
    return{
        async index(req,res) {
            const fishes = await Menu.find()
            return res.render('home',{fishes:fishes})
        }
    }
}
    

module.exports = homeController