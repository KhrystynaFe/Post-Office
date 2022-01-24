trigger DeliveryTrigger on Delivery__c (before insert, after insert) {
    if (Trigger.isBefore) {
        DeliveryTriggerHandler.checkForNotUniqueDeliveries(Trigger.new);
    } else if (Trigger.isAfter) {
        DeliveryTriggerHandler.setDeliveryFieldOfPackages(Trigger.new);
    }
}