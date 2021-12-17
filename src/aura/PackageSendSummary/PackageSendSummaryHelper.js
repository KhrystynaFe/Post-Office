({
    getTotalNumberOfPackages : function(cmp) {
        cmp.set("v.TotalNumberOfPackages", cmp.get("v.newPackages").length);
    },

    getTotalPrice : function(cmp) {
        let newPackages = cmp.get("v.newPackages");
        let totalPrice = 0;
        newPackages.forEach(function(item) {
            totalPrice = totalPrice + Number(item.Delivery_Price__c);
        });
        cmp.set("v.TotalPrice", totalPrice + "$");
    },

    getTotalWeight : function(cmp) {
        let newPackages = cmp.get("v.newPackages");
        let totalWeight = 0;
        newPackages.forEach(function(item) {
            totalWeight = totalWeight + Number(item.Weight__c);
        });
        cmp.set("v.TotalWeight", totalWeight);
    },

    getTotalSize : function(cmp) {
        let newPackages = cmp.get("v.newPackages");
        let totalSize = 0;
        newPackages.forEach(function(item) {
            totalSize = totalSize + Number(item.Size__c);
        });
        cmp.set("v.TotalSize", totalSize);
    },

    getTotalDistance : function(cmp) {
        let action = cmp.get("c.getDistance");
        action.setParams({newPackages : JSON.stringify(cmp.get("v.newPackages"))});
            action.setCallback(this, function(response){
                cmp.set("v.TotalDistance", response.getReturnValue()+"km");
            });
            $A.enqueueAction(action);
    }
})