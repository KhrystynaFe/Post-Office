({
    doInit: function (cmp, event, helper) {
        helper.SetPickList(cmp);
    },

    showSpinner: function (cmp) {
        cmp.set("v.toggleSpinner", true);
    },

    hideSpinner: function (cmp) {
        cmp.set("v.toggleSpinner", false);
    },

    addNewRow: function (cmp) {
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
        $A.enqueueAction(cmp.get("c.setPackageRefreshEvent"));
    },

    prepareToSavePackages: function (cmp, event, helper) {
        let action = cmp.get("c.savePackages");
        action.setParams({new_packages: JSON.stringify(cmp.get("v.newPackages"))});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                helper.showSuccessToast(cmp);
            } else if (state === "ERROR") {
                helper.showErrorToast("Can't deliver long road.");
            }
        });

        $A.enqueueAction(action);
        helper.setDefaultPackages(cmp);
        helper.setPackageRefreshEvent(cmp);
    },

    setPackageRefreshEvent: function (cmp, event, helper) {
        helper.setPackageRefreshEvent(cmp);
    },
})