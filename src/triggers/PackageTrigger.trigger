trigger PackageTrigger on Package__c (before insert, after insert) {
        if (Trigger.isBefore) {
                PackageTriggerHandler.getDistance(Trigger.new);
                PackageTriggerHandler.setDeliveryField(Trigger.new);
        } else if (Trigger.isAfter) {
                Map<Id, Package__c> newPackages = Trigger.newMap;
                PackageTriggerDateTimeRequest.getDateTime(newPackages.keySet());
        }
}