public with sharing class PackageSendSummaryController {

    @AuraEnabled
    public static Decimal getDistance(String newPackages){
        List<Package__c> newPackagesList =(List<Package__c>)JSON.deserialize(newPackages, List<Package__c>.class);
        Set<Id> postOfficeIds = new Set<Id>();
        Decimal totalDistance = 0;
        for(Package__c newPackage : newPackagesList) {
            postOfficeIds.add(newPackage.Sent_from__c);
            postOfficeIds.add(newPackage.Sent_to__c);
        }
        Map<Id, Post_Office__c> postOfficesMap = new Map<Id, Post_Office__c>([SELECT Id, Location__c FROM Post_Office__c WHERE Id IN :new List<Id>(postOfficeIds)]);
    
        for(Package__c newPackage : newPackagesList) {
            Decimal distance = Location.getDistance((postOfficesMap.get(newPackage.Sent_from__c)).Location__c, (postOfficesMap.get(newPackage.Sent_to__c)).Location__c, 'km');
            totalDistance = totalDistance + distance;
        }
        Decimal result = totalDistance.setScale(2, RoundingMode.HALF_UP);  
        return result;
    }

}