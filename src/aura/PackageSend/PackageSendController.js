({
    doInit: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.SetPickList(cmp);
        helper.hideSpinner(cmp);
    },

    addNewRow: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.generateNewRow(cmp);
        helper.hideSpinner(cmp);
    },

    prepareToSavePackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.prepareToSavePackages(cmp);
        helper.setDefaultPackages(cmp);
        helper.setPackageRefreshEvent(cmp);
        helper.hideSpinner(cmp);
    },

    setPackageRefreshEvent: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.setPackageRefreshEvent(cmp);
        helper.hideSpinner(cmp);
    },

    removeRow: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.removeRow(cmp, event);
        helper.hideSpinner(cmp);
    }
})