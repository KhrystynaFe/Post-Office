({
    doInit: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.SetPickList(cmp);
    },

    addNewRow: function (cmp, event, helper) {
        helper.generateNewRow(cmp);
    },

    prepareToSavePackages: function (cmp, event, helper) {
        helper.showSpinner(cmp);
        helper.prepareToSavePackages(cmp);

    },

    setPackageRefreshEvent: function (cmp, event, helper) {
        helper.setPackageRefreshEvent(cmp);
    },

    removeRow: function (cmp, event, helper) {
        helper.removeRow(cmp, event);
    }
})