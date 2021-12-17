({
    HandleAppEvent : function(cmp, event, helper) {
       cmp.set("v.newPackages", event.getParam("newPackages"));
       helper.getTotalNumberOfPackages(cmp);
       helper.getTotalPrice(cmp);
       helper.getTotalWeight(cmp);
       helper.getTotalSize(cmp);
       helper.getTotalDistance(cmp);
    },


})