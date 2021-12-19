({
    SetPickList: function (cmp) {
        let action = cmp.get("c.getPickListValue");
        action.setCallback(this, function (response) {
            let picklistSize = JSON.parse(response.getReturnValue());
            cmp.set("v.PickListSize", picklistSize.Size__c);
            cmp.set("v.PickListWeight", picklistSize.Weight__c);
            cmp.set("v.PickListType", picklistSize.Type__c);
            let state = response.getState();
            if (state === "SUCCESS") {
                this.setPickListPostOffices(cmp);
            } else if (state === "ERROR") {
                this.showErrorToast("PickList values was not set.");
            }
        });
        $A.enqueueAction(action);
    },

    setDefaultPackages: function (cmp) {
        cmp.set("v.newPackages", [{
            'Size__c': cmp.get('v.PickListSize')[0].value,
            'Weight__c': cmp.get('v.PickListWeight')[0].value,
            'Type__c': cmp.get('v.PickListType')[0].value,
            'Delivery_Price__c': 0,
            'Sent_from__c': cmp.get('v.PickListPostOffices')[0].Id,
            'Sent_to__c': cmp.get('v.PickListPostOffices')[0].Id
        }]);
    },

    setPickListPostOffices: function (cmp) {
        let action = cmp.get("c.getPostOffices");
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                cmp.set("v.PickListPostOffices", response.getReturnValue());
                this.setDefaultPackages(cmp);
            } else if (state === "ERROR") {
                this.showErrorToast("Picklist values for Post Offices was not set.");
            }
        });
        $A.enqueueAction(action);
    },

    showSuccessToast: function () {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "The package has been saved successfully.",
            "type": "success"
        });
        toastEvent.fire();
    },

    showErrorToast: function (message) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Error!",
            "message": message,
            "type": "error"
        });
        toastEvent.fire();
    },

    setPackageRefreshEvent: function (cmp) {
        let PackageRefreshEventEvent = $A.get("e.c:ApplicationEvent");
        let newPackages = cmp.get("v.newPackages");
        PackageRefreshEventEvent.setParams({"newPackages": newPackages});
        PackageRefreshEventEvent.fire();
    },
})