public with sharing class PackageDeliveryFieldSetter {
    public static void setDeliveryFieldOfPackages(List<Delivery__c> newDeliveries) {
        List<Package__c> packagesWithEmptyDeliveryField = [SELECT Sent_from__c, Sent_to__c FROM Package__c WHERE Delivery__c = NULL];
        List<Package__c> packagesToUpdate = new List<Package__c>();
        for (Delivery__c newDelivery : newDeliveries) {
            for (Package__c packageWithEmptyDeliveryField : packagesWithEmptyDeliveryField) {
                if (packageWithEmptyDeliveryField.Sent_to__c == newDelivery.Receiver__c &&
                        packageWithEmptyDeliveryField.Sent_from__c == newDelivery.Sender__c) {
                    packageWithEmptyDeliveryField.Delivery__c = newDelivery.Id;
                    packagesToUpdate.add(packageWithEmptyDeliveryField);
                }
            }
        }
        update packagesToUpdate;
    }
}