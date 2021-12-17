public with sharing class PackageCont {
    @AuraEnabled
    public static void savePackage(String new_package){
        List<Package__c> newPackagesList =(List<Package__c>)JSON.deserialize(new_package, List<Package__c>.class);
        insert newPackagesList;
        
    }

    @AuraEnabled
    public static String getPickListValue() {
        Map<String, List<PickListOption>> result = new Map<String, List<PickListOption>>();
        result.put('Size__c', toPicklistOptions(Package__c.Size__c.getDescribe().getPickListValues()));
        result.put('Weight__c', toPicklistOptions(Package__c.Weight__c.getDescribe().getPickListValues()));
        result.put('Type__c', toPicklistOptions(Package__c.Type__c.getDescribe().getPickListValues()));
        return JSON.serialize(result);
    }

    @AuraEnabled
    public static List<Post_Office__c> getPostOffices(){
        List<Post_Office__c> postOffices = [SELECT ID, Name FROM Post_Office__c];
        return postOffices;
    }

    @TestVisible private static List<PicklistOption> toPicklistOptions(List<Schema.PicklistEntry> picklistEnties) {
        List<PickListOption> result = new List<PicklistOption>();
        for (Schema.PicklistEntry entry : picklistEnties) {
            result.add(new PicklistOption(entry));
        }
        return result;
    }

    public class PickListOption {
        String value;
        String label;

        public PicklistOption(Schema.PicklistEntry entry) {
            value = entry.getValue();
            label = entry.getLabel();
        }

    }
}