({
    generateNewDeliveries: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.generateNewDeliveries(cmp);
        helper.hideSpinner(cmp);
    },

    setDelivery: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.setDelivery(cmp);
        helper.hideSpinner(cmp);
    },

    handleChangingDelivery: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.setPostOffices(cmp);
        helper.setPackages(cmp);
        helper.hideSpinner(cmp);
    },

    handleSelectingReadyToPickUpPackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.updateSelectedReadyToPickUpPackagesCountText(cmp, event);
        cmp.set("v.SelectedReadyToPickUpPackages", event.getParam("selectedRows"));
        console.log(cmp.get("v.SelectedReadyToPickUpPackages"));
        helper.hideSpinner(cmp);
    },

    handleSelectingDeliveringPackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.updateSelectedDeliveringPackagesCountText(cmp, event);
        cmp.set("v.SelectedDeliveringPackages", event.getParam("selectedRows"));
        console.log(cmp.get("v.SelectedDeliveringPackages"));
        helper.hideSpinner(cmp);
    },

    handleSelectingDeliveredButNotPaidPackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.updateSelectedDeliveredButNotPaidPackagesCountText(cmp, event);
        cmp.set("v.SelectedDeliveredButNotPaidPackages", event.getParam("selectedRows"));
        helper.hideSpinner(cmp);
    },

    sendSelectedPackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.sendSelectedPackages(cmp);
        helper.hideSpinner(cmp);
    },

    receiveSelectedPackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.receiveSelectedPackages(cmp);
        helper.hideSpinner(cmp);
    },

    makeSelectedPackagesPaid: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.makeSelectedPackagesPaid(cmp);
        helper.hideSpinner(cmp);
    }

});