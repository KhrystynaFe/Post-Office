({
    SetPickList: function (cmp) {
        let action = cmp.get("c.getPickListValue");
        action.setCallback(this, function (response) {
            let picklistSize = JSON.parse(response.getReturnValue());
            cmp.set("v.pickListSize", picklistSize.Size__c);
            cmp.set("v.pickListWeight", picklistSize.Weight__c);
            cmp.set("v.pickListType", picklistSize.Type__c);
            let state = response.getState();
            if (state === "SUCCESS") {
                this.setPickListPostOffices(cmp);
            } else if (state === "ERROR") {
                this.hideSpinner(cmp);
                this.showErrorToast("PickList values was not set.");
            }
        });
        $A.enqueueAction(action);
    },

    setDefaultPackages: function (cmp) {
        cmp.set("v.newPackages", [{
            'Size__c': cmp.get('v.pickListSize')[0].value,
            'Weight__c': cmp.get('v.pickListWeight')[0].value,
            'Type__c': cmp.get('v.pickListType')[0].value,
            'Delivery_Price__c': 0,
            'Sent_from__c': cmp.get('v.pickListPostOffices')[0].Id,
            'Sent_to__c': cmp.get('v.pickListPostOffices')[0].Id
        }]);
        this.setPackageRefreshEvent(cmp);
    },

    setPickListPostOffices: function (cmp) {
        let action = cmp.get("c.getPostOffices");
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                cmp.set("v.pickListPostOffices", response.getReturnValue());
                this.setDefaultPackages(cmp);
                this.hideSpinner(cmp);
            } else if (response.getState() === "ERROR") {
                this.hideSpinner(cmp);
                this.showErrorToast("Picklist values for Post Offices was not set.");
            }
        });
        $A.enqueueAction(action);
    },

    generateNewRow: function (cmp) {
        let packages = cmp.get("v.newPackages");
        if (cmp.get('v.pickListSize').length && cmp.get('v.pickListWeight').length && cmp.get('v.pickListType').length && cmp.get('v.pickListPostOffices').length) {
            packages.push({
                'Size__c': cmp.get('v.pickListSize')[0].value,
                'Weight__c': cmp.get('v.pickListWeight')[0].value,
                'Type__c': cmp.get('v.pickListType')[0].value,
                'Delivery_Price__c': '',
                'Sent_from__c': cmp.get('v.pickListPostOffices')[0].Id,
                'Sent_to__c': cmp.get('v.pickListPostOffices')[0].Id,
            })
            cmp.set("v.newPackages", packages);
            this.setPackageRefreshEvent(cmp);
        } else {
            this.showErrorToast("New Row can not be created");
        }
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
                this.hideSpinner(cmp);
                this.setDefaultPackages(cmp);
                this.showSuccessToast(cmp);
            } else if (state === "ERROR") {
                this.hideSpinner(cmp);
                this.setDefaultPackages(cmp);
                this.showErrorToast("Can't deliver long road.");
            }
        });
        $A.enqueueAction(action);
    },

    removeRow: function (cmp, event) {
        let newPackages = cmp.get("v.newPackages");
        newPackages.splice(event.target.dataset.index, 1);
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