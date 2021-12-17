({
    doInit: function (cmp, event, helper) {

        helper.SetPickList(cmp);
        
    },

    showSpinner : function(cmp) {
        cmp.set("v.toggleSpinner", true);
    },

    hideSpinner : function(cmp) {
        cmp.set("v.toggleSpinner", false);
    },

    addNewRow: function (cmp) {
        let packages = cmp.get("v.newPackage");
            packages.push({
                'Size__c': cmp.get('v.PickListSize')[0].value,
                'Weight__c': cmp.get('v.PickListWeight')[0].value,
                'Type__c': cmp.get('v.PickListType')[0].value,
                'Delivery_Price__c': '',
                'Sent_from__c': cmp.get('v.PickListPostOffices')[0].Id,
                'Sent_to__c': cmp.get('v.PickListPostOffices')[0].Id,
            })
        cmp.set("v.newPackage", packages);
        $A.enqueueAction(cmp.get("c.setAppEvent"));
    },
   
    savePackages: function (cmp, event, helper) {
        let action = cmp.get("c.savePackage");
        action.setParams({new_package: JSON.stringify(cmp.get("v.newPackage"))});
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
        helper.setAppEvent(cmp);

    },

    setAppEvent: function(cmp, event, helper) {
        helper.setAppEvent(cmp); 
        },

})