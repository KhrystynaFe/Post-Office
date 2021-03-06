({
    setTotalNumberOfPackages: function (cmp) {
        cmp.set("v.totalNumberOfPackages", cmp.get("v.newPackages").length);
    },

    setTotalPrice: function (cmp) {
        let newPackages = cmp.get("v.newPackages");
        let totalPrice = 0;
        newPackages.forEach(function (item) {
            totalPrice = totalPrice + Number(item.Delivery_Price__c);
        });
        cmp.set("v.totalPrice", totalPrice + "$");
    },

    setTotalWeight: function (cmp) {
        let newPackages = cmp.get("v.newPackages");
        let totalWeight = 0;
        newPackages.forEach(function (item) {
            totalWeight = totalWeight + Number(item.Weight__c);
        });
        cmp.set("v.totalWeight", totalWeight);
    },

    setTotalSize: function (cmp) {
        let newPackages = cmp.get("v.newPackages");
        let totalSize = 0;
        newPackages.forEach(function (item) {
            totalSize = totalSize + Number(item.Size__c);
        });
        cmp.set("v.totalSize", totalSize);
    },

    setTotalDistance: function (cmp) {
        let action = cmp.get("c.getDistance");
        action.setParams({newPackages: JSON.stringify(cmp.get("v.newPackages"))});
        action.setCallback(this, function (response) {
            cmp.set("v.totalDistance", response.getReturnValue() + "km");
        });
        $A.enqueueAction(action);
    }
})