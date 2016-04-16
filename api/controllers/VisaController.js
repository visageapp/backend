var visa = require('../utils/visa');

module.exports = {
    index(req, res){
        visa('vctc/customerrules/v1/consumertransactioncontrols', 
            {'primaryAccountNumber': '4667596775551010'},
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ", 
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
        .then(function (stuff) { console.log(stuff); }, 
            function (error) { console.log(error); });
    }
}
