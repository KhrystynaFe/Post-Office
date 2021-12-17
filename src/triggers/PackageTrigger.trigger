trigger PackageTrigger on Package__c (before insert, after insert) {
        if (Trigger.isBefore) {
                PackageTriggerHandler.getDistance(Trigger.new);
        } else if (Trigger.isAfter) {
                Map<Id, Package__c> newPackages = Trigger.newMap;
                Set<Id> newPackagesId = newPackages.keySet();
                PackageTriggerDateTimeHandler.getDateTime(newPackagesId);
        }
}