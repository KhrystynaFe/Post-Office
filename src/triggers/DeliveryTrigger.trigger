trigger DeliveryTrigger on Delivery__c (before insert, after insert) {
    if (Trigger.isBefore) {
        DeliveryTriggerHandler.beforeInsert(Trigger.new);
    } else if (Trigger.isAfter) {
        DeliveryTriggerHandler.afterInsert(Trigger.new);
    }
}