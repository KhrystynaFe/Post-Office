({
    handlePackageRefreshEvent: function (cmp, event, helper) {
        cmp.set("v.newPackages", event.getParam("newPackages"));
        helper.setTotalNumberOfPackages(cmp);
        helper.setTotalPrice(cmp);
        helper.setTotalWeight(cmp);
        helper.setTotalSize(cmp);
        helper.setTotalDistance(cmp);
    },
})