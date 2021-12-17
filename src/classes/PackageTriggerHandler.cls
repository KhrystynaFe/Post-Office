public with sharing class PackageTriggerHandler {
    public static void getDistance (List<Package__c> newPackages) {
        List<Id> sentFromId = new List<String>();
        List<Id> sentToId = new List<String>();
        for(Package__c newPackage : newPackages) {
            sentFromId.add(newPackage.Sent_from__c);
            sentToId.add(newPackage.Sent_to__c);
        }
        Map<Id, Post_Office__c> postOfficesFrom = new Map<Id, Post_Office__c>([SELECT Id, Location__c FROM Post_Office__c WHERE Id IN :sentFromId]);
        Map<Id, Post_Office__c> postOfficesTo = new Map<Id, Post_Office__c>([SELECT Id, Location__c FROM Post_Office__c WHERE Id IN :sentToId]);
    
        for(Package__c newPackage : newPackages) {
            Double distance = Location.getDistance((postOfficesFrom.get(newPackage.Sent_from__c)).Location__c, (postOfficesTo.get(newPackage.Sent_to__c)).Location__c, 'km');
            if (distance>100) {
                newPackage.addError('can\'t deliver long road');
            }
        }
    }
}