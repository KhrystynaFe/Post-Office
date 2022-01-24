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
            } else if (response.getState() === "ERROR") {
                this.showErrorToast("Picklist values for Post Offices was not set.");
            }
        });
        $A.enqueueAction(action);
    },

    generateNewRow: function (cmp) {
        let packages = cmp.get("v.newPackages");
        packages.push({
            'Size__c': cmp.get('v.PickListSize')[0].value,
            'Weight__c': cmp.get('v.PickListWeight')[0].value,
            'Type__c': cmp.get('v.PickListType')[0].value,
            'Delivery_Price__c': '',
            'Sent_from__c': cmp.get('v.PickListPostOffices')[0].Id,
            'Sent_to__c': cmp.get('v.PickListPostOffices')[0].Id,
        })
        cmp.set("v.newPackages", packages);
        this.setPackageRefreshEvent(cmp);
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

    prepareToSavePackages: function (cmp) {
        let action = cmp.get("c.savePackages");
        action.setParams({new_packages: JSON.stringify(cmp.get("v.newPackages"))});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showSuccessToast(cmp);
            } else if (state === "ERROR") {
                this.showErrorToast("Can't deliver long road.");
            }
        });
        $A.enqueueAction(action);
    },

    removeRow: function (cmp, event) {
        let newPackages = cmp.get("v.newPackages");
        newPackages.splice(event.target.dataset.index, 1);
        console.log(event.target.dataset.index);
        cmp.set("v.newPackages", newPackages);
        this.setPackageRefreshEvent(cmp);
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

    showSpinner: function (cmp) {
        cmp.set("v.toggleSpinner", true);
    },

    hideSpinner: function (cmp) {
        cmp.set("v.toggleSpinner", false);
    },
})