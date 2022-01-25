({
    generateNewDeliveries: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.generateNewDeliveries(cmp);
    },

    setDelivery: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.setDelivery(cmp);
    },

    handleChangingDelivery: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.setPostOffices(cmp);
        helper.setPackages(cmp);
    },

    handleSelectingReadyToPickUpPackages: function (cmp, event, helper) {
        helper.updateSelectedReadyToPickUpPackagesCountText(cmp, event);
        cmp.set("v.selectedReadyToPickUpPackages", event.getParam("selectedRows"));
    },

    handleSelectingDeliveringPackages: function (cmp, event, helper) {
        helper.updateSelectedDeliveringPackagesCountText(cmp, event);
        cmp.set("v.selectedDeliveringPackages", event.getParam("selectedRows"));
    },

    handleSelectingDeliveredButNotPaidPackages: function (cmp, event, helper) {
        helper.updateSelectedDeliveredButNotPaidPackagesCountText(cmp, event);
        cmp.set("v.selectedDeliveredButNotPaidPackages", event.getParam("selectedRows"));
    },

    sendSelectedPackages: function (cmp, event, helper) {
        if (cmp.get("v.selectedReadyToPickUpPackages").length) {
            helper.showSpinner(cmp);
            helper.sendSelectedPackages(cmp);
        }
    },

    receiveSelectedPackages: function (cmp, event, helper) {
        if (cmp.get("v.selectedDeliveringPackages").length) {
            helper.showSpinner(cmp);
            helper.receiveSelectedPackages(cmp);
        }
    },

    makeSelectedPackagesPaid: function (cmp, event, helper) {
        if (cmp.get("v.selectedDeliveredButNotPaidPackages").length) {
            helper.showSpinner(cmp);
            helper.makeSelectedPackagesPaid(cmp);
        }
    }

});